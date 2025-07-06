import z from "zod";

export const GetTableParams = z
   .object({
      orderBy: z.enum(["asc", "desc"]).default("asc"),
   })
   .optional()
   .or(z.void());
