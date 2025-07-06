// import { DrizzleClient } from "drizzle-orm/pg-core";

import { databasesTable, DatabasesTable } from "@/db/schema";
import { BadRequestException } from "@/infra/errors";
import databaseSchema from "@/dtos/databases.dto";
import { eq, SQL } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

type CreateDatabaseSchema = StrictOmit<DatabasesTable["$inferSelect"], "id" | "created_at" | "updated_at">;
type UpdateDatabaseSchema = Partial<CreateDatabaseSchema>;

// function convertWhere(where: Record<string, any>, table: any): any {
//    if (Array.isArray(where.AND)) {
//       return and(...where.AND.map((cond) => convertWhere(cond, table)));
//    }

//    if (Array.isArray(where.OR)) {
//       return or(...where.OR.map((cond) => convertWhere(cond, table)));
//    }

//    if (where.NOT) {
//       return not(convertWhere(where.NOT, table));
//    }

//    // Base case: field filter
//    const [field, value] = Object.entries(where)[0];
//    return eq(table[field], value);
// }

export default class Database {
   declare private readonly database: NodePgDatabase;
   declare private readonly table: DatabasesTable;

   constructor(database: NodePgDatabase) {
      this.database = database;
      this.table = databasesTable;
   }

   async findMany(where?: SQL | undefined) {
      return await this.database.select().from(this.table).where(where);
   }

   async findUnique(id: number) {
      const data = await this.database.select().from(this.table).where(eq(this.table.id, id));
      return data?.[0] || null;
   }

   async create(data: CreateDatabaseSchema) {
      const schema = databaseSchema.omit({ id: true });
      const validation = await schema.safeParseAsync(data);
      if (!validation.success) {
         const invalidFields = validation.error.issues.map((x) => x.path.join(".")).join("', '");
         throw new BadRequestException(`Invalid data! Check the fields: '${invalidFields}'`);
      }
      await this.database.insert(this.table).values(validation.data);
   }

   async update(id: number, data: UpdateDatabaseSchema) {
      const schema = databaseSchema.omit({ id: true }).partial();
      const validation = await schema.safeParseAsync(data);
      if (!validation.success) {
         const invalidFields = validation.error.issues.map((x) => x.path.join(".")).join("', '");
         throw new BadRequestException(`Invalid data! Check the fields: '${invalidFields}'`);
      }
      await this.database.update(this.table).set(validation.data).where(eq(this.table.id, id));
   }

   async delete(id: number) {
      await this.database.delete(this.table).where(eq(this.table.id, id));
   }
}
