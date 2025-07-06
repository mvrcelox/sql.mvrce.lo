import "server-only";

import { and, eq, SQL } from "drizzle-orm";
import { databasesTable, DatabasesTable } from "@/db/schema";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import to from "@/helpers/to";
import type { DatabaseSchema } from "@/dtos/databases.dto";
import { BadRequestException, NotImplementedException } from "@/infra/errors";

type CreateDatabaseSchema = StrictOmit<DatabaseSchema, "id">;
type UpdateDatabaseSchema = Partial<CreateDatabaseSchema>;

export default class DatabaseService {
   private readonly database: NodePgDatabase;
   private readonly table: DatabasesTable = databasesTable;

   private constructor(database: NodePgDatabase) {
      this.database = database;
   }

   static build(database: NodePgDatabase) {
      return new DatabaseService(database);
   }

   public async get(where?: SQL | undefined) {
      return await this.database.select().from(this.table).where(where);
   }

   public async find(id: string) {
      const data = await this.database.select().from(this.table).where(eq(this.table.id, id));
      return data?.[0] || null;
   }

   public async create(data: CreateDatabaseSchema) {
      return await this.database.insert(this.table).values(data);
   }

   public async update(id: string, data: UpdateDatabaseSchema) {
      if (!data.owner_id) throw new BadRequestException("Owner ID is required for updating the database.");
      const response = await to(
         this.database
            .update(this.table)
            .set(data)
            .where(and(eq(this.table.id, id), eq(this.table.owner_id, data.owner_id))),
      );

      if (response.success) return response.data;
   }

   public async delete(id: string, ownerId: number) {
      await this.database.delete(this.table).where(and(eq(this.table.id, id), eq(this.table.owner_id, ownerId)));
   }

   public async share() {
      throw new NotImplementedException("Sharing databases is not implemented yet.");
   }
}
