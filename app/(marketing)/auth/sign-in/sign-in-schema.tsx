import z from "zod";

export type SignInInput = z.input<typeof signInSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
export const signInSchema = z.object({
   email: z.string().min(1, "Too small").email("Invalid email"),
});

export default signInSchema;
