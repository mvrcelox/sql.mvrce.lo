"use server";

import { CredentialsSchema, DatabaseSchema } from "@/validators/database";
import { authedProcedure } from "./auth";
import db from "@/db";
import { databasesTable } from "@/db/schema";
import { BadRequestError, InternalServerError, NotFoundError } from "@/infra/errors";
import { and, asc, desc, eq } from "drizzle-orm";
import { GetTableParams } from "@/validators/_default";
import { createServerAction } from "zsa";
import { z } from "zod";
import { Client } from "pg";
import config from "@/config/site";
import tryCatch from "@/helpers/try-catch";
import { createPSQLDatabase } from "@/lib/database-factory";

import { AES, enc } from "crypto-js";

export type GetDatabasesReturn = NonNullable<Awaited<ReturnType<typeof getDatabases>>[0]>;
export const getDatabases = authedProcedure.input(GetTableParams).handler(async ({ ctx, input }) => {
   try {
      const response = await db
         .select({ id: databasesTable.id, name: databasesTable.name, description: databasesTable.description })
         .from(databasesTable)
         .where(eq(databasesTable.owner_id, ctx.user?.id ?? 0))
         .orderBy(input?.orderBy === "asc" ? asc(databasesTable.id) : desc(databasesTable.id));
      return response;
   } catch (error) {
      console.error(error);
      throw new InternalServerError({ cause: error });
   }
});

export const findDatabase = authedProcedure.input(z.number().min(1, "Invalid ID")).handler(async ({ ctx, input }) => {
   try {
      const databases = await db
         .select()
         .from(databasesTable)
         .where(and(eq(databasesTable.id, input), eq(databasesTable.owner_id, ctx.user?.id ?? 0)));

      const database = databases?.[0];
      if (!database) throw new NotFoundError("Database doesn't exists.");

      database.password = AES.decrypt(database.password, process.env.CRYPTO_KEY ?? "").toString(enc.Utf8);
      return database;
   } catch (error) {
      throw new InternalServerError({ cause: error });
   }
});

export const createDatabase = authedProcedure.input(DatabaseSchema).handler(async ({ ctx, input }) => {
   if (input.id) throw new BadRequestError("Bad request! You can't create a database with a predefined ID.");
   const database: typeof databasesTable.$inferInsert = { ...input, owner_id: ctx.user?.id ?? 0 };

   if (database.password) database.password = AES.encrypt(database.password, process.env.CRYPTO_KEY || "").toString();

   try {
      await db.insert(databasesTable).values(database);
   } catch (error) {
      console.error(error);
      throw new InternalServerError({ cause: error });
   }
});

export const updateDatabase = authedProcedure.input(DatabaseSchema.partial()).handler(async ({ ctx, input }) => {
   if (!input.id) throw new BadRequestError("Bad request! ID is missing.");

   // Hold all the rows fetched with the query params passed.
   let rows = [];
   try {
      rows = await db
         .select({ id: databasesTable.id })
         .from(databasesTable)
         .where(and(eq(databasesTable.id, input.id), eq(databasesTable.owner_id, ctx.user?.id ?? 0)));
   } catch (error) {
      throw new InternalServerError({ cause: error });
   }

   if (!rows.length) throw new NotFoundError("Database doesn't exists.");

   const database = { ...input, owner_id: ctx.user?.id };
   try {
      await db
         .update(databasesTable)
         .set(database)
         .where(and(eq(databasesTable.id, input.id), eq(databasesTable.owner_id, ctx.user?.id ?? 0)));
   } catch (error) {
      throw new InternalServerError({ cause: error });
   }
});

export const deleteDatabase = authedProcedure.input(z.number().min(1, "Invalid ID")).handler(async ({ ctx, input }) => {
   const { data, error } = await tryCatch(
      db.delete(databasesTable).where(and(eq(databasesTable.id, input), eq(databasesTable.owner_id, ctx.user.id))),
   );

   if (error) throw new InternalServerError({ cause: error });

   if (!data.rowCount || data.rowCount <= 0) throw new NotFoundError("Database doesn`t exists.");
});

export const queryDatabase = authedProcedure
   .input(
      z.object({
         databaseId: z.number().min(1, "Invalid ID"),
         sql: z.string().min(1, "Invalid SQL"),
         params: z.array(z.string()).optional(),
      }),
   )
   .handler(async ({ input }) => {
      const [client, error] = await getConnection(input.databaseId);
      if (error) throw error;

      try {
         const result = await client?.query(input.sql, input.params);
         if (!result) return { fields: [], rows: [] };
         return { fields: Array.from(result.fields), rows: Array.from(result.rows) };
      } catch (error) {
         console.error(error);
         throw new InternalServerError({ cause: error });
      }
   });

export const connectDatabase = authedProcedure.input(z.number().min(1, "Invalid ID")).handler(async ({ input }) => {
   const [found, error] = await findDatabase(input);

   if (error) throw new InternalServerError({ cause: error });
   const client = createPSQLDatabase(found);

   try {
      await client?.connect();
   } catch (error) {
      console.error(error);
      throw new InternalServerError({ cause: error });
   }

   try {
      const [tables, views, indexes, sequences] = await Promise.all([
         client.query<{ table_name: string }>(
            `SELECT table_name FROM information_schema.tables as ist WHERE ist.table_schema = 'public' AND ist.table_type = 'BASE TABLE' ORDER BY table_name`,
         ),
         client.query<{ table_name: string }>(
            `SELECT table_name FROM information_schema.views as isv where isv.table_schema = 'public' ORDER BY table_name`,
         ),
         client.query<{ indexname: string }>(`SELECT indexname FROM pg_indexes WHERE schemaname = 'public'`),
         client.query<{ sequencename: string }>(`SELECT sequencename FROM pg_sequences WHERE schemaname = 'public'`),
      ]);
      const { id, name, description } = found;
      return {
         id,
         name,
         description,
         tables: tables.rows,
         views: views.rows,
         indexes: indexes.rows,
         sequences: sequences.rows,
      };
   } catch (error) {
      console.error(error);
      throw new InternalServerError({ cause: error });
   } finally {
      await client?.end();
   }
});

interface RowReturn {
   [k: string]: unknown;
   Column: string;
   Position: number;
   Type: string;
   Nullable: "YES" | "NO";
   Default: string | number | null;
   Comment: string | null;
}

export const getConnection = authedProcedure.input(z.number().min(1, "Invalid ID")).handler(async ({ input }) => {
   const [found, error] = await findDatabase(input);
   if (error) throw new InternalServerError({ cause: error });

   const client = createPSQLDatabase(found);

   try {
      await client?.connect();
      return client;
   } catch (error) {
      console.error(error);
      throw new InternalServerError({ cause: error });
   }
});

export const getDatabaseProperties = authedProcedure
   .input(z.object({ databaseId: z.number(), tableName: z.string() }))
   .onInputParseError(async (error) => {
      console.error(error);
      throw new BadRequestError("Invalid database!");
   })
   .handler(async ({ input }) => {
      const { databaseId, tableName } = input;

      const [found, err] = await findDatabase(databaseId);
      if (err) throw err;
      if (!found) throw new NotFoundError("Database not found or doesn't exists.");

      const { host, database, username, password, port } = found;
      const client = createPSQLDatabase({ host, database, username, password, port });

      try {
         await client?.connect();
      } catch (error) {
         console.error(error);
         return;
      }

      if (client.status === "disconnected") {
         console.error("is disconnected, cant query");
         return;
      }

      try {
         const data = await client.query<RowReturn>(
            `SELECT c.column_name as "Column", c.ordinal_position as "Position", case when c.character_maximum_length > 0 then concat(c.udt_name,'(',c.character_maximum_length,')') else c.udt_name end as "Type", c.is_nullable as "Nullable", c.column_default as "Default", replace(pgd.description,'
      ','\n') as "Comment"
               FROM pg_catalog.pg_statio_all_tables as st
               INNER JOIN pg_catalog.pg_description pgd on pgd.objoid = st.relid
               RIGHT JOIN information_schema.columns c on pgd.objsubid = c.ordinal_position and c.table_schema = st.schemaname and c.table_name = st.relname
               WHERE c.table_schema = 'public' and c.table_name = $1
               ORDER BY c.ordinal_position`,
            [tableName],
         );
         if (!data) return;

         return data.rows;
      } catch (error) {
         if ((error as { code?: string })?.code === "42P01") {
            throw new NotFoundError();
         }
      }
   });

// Anonymous actions

export const testDatabase = createServerAction()
   .input(CredentialsSchema)
   .onInputParseError(async (error) => {
      console.error(error);
      throw new BadRequestError("Invalid database!");
   })
   .handler(async ({ input }) => {
      // if (connection === 1) {
      // }
      const client = createPSQLDatabase(input);

      try {
         await client?.connect();
      } catch (error) {
         console.error(error);

         throw new InternalServerError({ cause: error });
      } finally {
         await client?.end();
      }
   });
