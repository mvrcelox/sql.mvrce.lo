"use server";

import config from "@/config/site";
import { BadRequestError, InternalServerError } from "@/infra/errors";
import DatabaseSchema from "@/validators/database";
import { Client } from "pg";
import { z } from "zod";
import { createServerAction } from "zsa";

export const testDatabase = createServerAction()
   .input(
      z.object({
         ...DatabaseSchema.shape,
         name: z.string().max(64, "Too large"),
      }),
   )
   .onInputParseError(async (error) => {
      console.error(error);
      throw new BadRequestError("Invalid database!");
   })
   .handler(async ({ input }) => {
      const { connection, ...credentials } = input;
      if (connection === 1) {
      }
      const client = new Client({
         host: credentials.host,
         port: credentials.port,
         database: credentials.database,
         user: credentials.username,
         password: credentials.password,
         application_name: config.fullName,
         connectionTimeoutMillis: 10_000,
      });

      try {
         await client?.connect();
      } catch (error) {
         console.error(error);

         throw new InternalServerError({ cause: error });
      } finally {
         await client?.end();
      }
   });
