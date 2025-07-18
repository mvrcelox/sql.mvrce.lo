import z from "zod";
import credentialsSchema from "./credentials";

export type DatabaseInput = z.input<typeof databaseSchema>;
export type DatabaseOutput = z.output<typeof databaseSchema>;
export type DatabaseSchema = z.infer<typeof databaseSchema>;

const databaseSchema = z.object({
   id: z.string().uuid().optional(),
   name: z.string().min(1, "Too small").max(64, "Too large"),
   description: z.string().max(512, "Too large").optional(),
   owner_id: z.number().min(1),
   connection: z.number().min(1, "Invalid value").default(1),
   ...credentialsSchema.shape,
});

export default databaseSchema;
