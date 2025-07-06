import z from "zod";

export type ForgotPasswordInput = z.input<typeof forgotPasswordSchema>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export const forgotPasswordSchema = z.object({
   email: z.string().min(1, "Too small").email("Invalid email"),
});

export default forgotPasswordSchema;
