import z from "zod";

export type CredentialsInput = z.input<typeof CredentialsSchema>;
export type CredentialsOutput = z.output<typeof CredentialsSchema>;

const CredentialsSchema = z.object({
   host: z.string().min(1, "Too small"),
   port: z.coerce.number().optional().default(5432),
   database: z.string().min(1, "Too small"),
   username: z.string().min(1, "Too small"),
   password: z.string().optional().default(""),
   ssl: z.boolean().default(false),
});

export type DatabaseInput = z.input<typeof DatabaseSchema>;
export type DatabaseOutput = z.output<typeof DatabaseSchema>;

const DatabaseSchema = z.object({
   id: z.number().min(0).optional(),
   name: z.string().min(1, "Too small").max(64, "Too large"),
   connection: z.number().min(1, "Invalid value").default(1),
   ...CredentialsSchema.shape,
});

export { DatabaseSchema as default, DatabaseSchema, CredentialsSchema };
