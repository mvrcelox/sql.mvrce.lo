"use server";

import pg from "pg";
import { z } from "zod";

import { authedProcedure } from "@/models/auth";
import db from "@/db";
import config from "@/config/site";
import { databasesTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { InternalServerError, NotFoundError } from "@/infra/errors";
import tryCatch from "@/helpers/try-catch";

export const connectToDatabase = authedProcedure
   .input(z.number().min(1, "Invalid database ID"))
   .handler(async ({ ctx, input }) => {
      const { data: databases, error } = await tryCatch(
         db
            .select()
            .from(databasesTable)
            .where(and(eq(databasesTable.id, input), eq(databasesTable.owner_id, ctx.user.id))),
      );
      if (error) throw new InternalServerError({ cause: error });
      if (!databases?.length) throw new NotFoundError("Database doesn't exist.");

      const database = databases[0];

      const client = new pg.Client({
         host: database.host,
         port: database.port,
         database: database.database,
         user: database.username,
         password: database.password ?? "",
         application_name: config.fullName,
         // Not trying to connect infinitely.
         connectionTimeoutMillis: 10_000,
      });

      try {
         await client.connect();
         return true;
      } catch (error) {
         console.error(error);

         throw new InternalServerError({ cause: error });
      } finally {
         await client?.end();
      }
   });
