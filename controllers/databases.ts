"use server";

import { BadRequestError, InternalServerError } from "@/infra/errors";
import { createPSQLDatabase } from "@/lib/database-factory";
import DatabaseSchema from "@/validators/database";
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
      const client = createPSQLDatabase(credentials);

      try {
         await client?.connect();
      } catch (error) {
         console.error(error);

         throw new InternalServerError({ cause: error });
      } finally {
         await client?.end();
      }
   });
