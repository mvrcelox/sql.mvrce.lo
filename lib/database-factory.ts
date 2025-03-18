import "server-only";
import config from "@/config/site";
import { MethodNotAllowedError, NotFoundError } from "@/infra/errors";
import { CredentialsInput } from "@/validators/database";
import { Client, FieldDef } from "pg";

type Status = "connected" | "disconnected";
interface IDatabase<TStatus extends Status> {
   status: TStatus;
   connect: () => Promise<IDatabase<"connected">>;
   query: <T extends Record<string, unknown>>(
      sql: string,
      params?: unknown[],
   ) => Promise<{ count: number; rows: T[]; fields: FieldDef[] }> | never;
   end: () => Promise<IDatabase<"disconnected">>;
}

export function createPSQLDatabase(input: CredentialsInput): IDatabase<"disconnected"> {
   return new PSQLDatabase(input);
}

class PSQLDatabase<TStatus extends Status = "disconnected"> implements IDatabase<TStatus> {
   public status: TStatus = "disconnected" as TStatus;
   private client: Client;

   constructor(credentials: CredentialsInput) {
      const { host, port, database, username, password } = credentials;
      this.client = new Client({
         host,
         port,
         database,
         user: username,
         password,
         application_name: config.fullName,
         connectionTimeoutMillis: 10_000,
      });
   }

   public async connect(): Promise<IDatabase<"connected">> {
      if (!this.client) throw new NotFoundError(`Client doesn't exist. Try re-creating the database`);

      await this.client.connect();
      this.status = "connected" as TStatus;
      return this as unknown as IDatabase<"connected">;
   }

   public async query<T>(sql: string, params?: unknown[]): Promise<{ count: number; rows: T[]; fields: FieldDef[] }> {
      if (this.status !== "connected") throw new MethodNotAllowedError("You need to connect first!");

      const response = await this.client.query(sql, params);
      return { count: response?.rowCount ?? 0, rows: response.rows as T[], fields: response.fields };
   }

   public async end(): Promise<IDatabase<"disconnected">> {
      await this.client?.end();
      this.status = "disconnected" as TStatus;

      return this as IDatabase<"disconnected">;
   }
}
