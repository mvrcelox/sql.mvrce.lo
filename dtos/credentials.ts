import z from "zod";

export type ICredentials = z.infer<typeof credentialsSchema>;
export type CredentialsSchema = z.infer<typeof credentialsSchema>;

export const credentialsSchema = z.object({
   // schema: z.string().min(1, "Too small").default("public"),
   host: z.string().min(1, "Too small"),
   port: z.coerce.number().min(0, "Too small").max(65535, "Too big").optional().default(5432),
   database: z.string().min(1, "Too small"),
   username: z.string().min(1, "Too small"),
   password: z.string().optional().default(""),
   ssl: z.boolean().default(false),
});

export default credentialsSchema;
