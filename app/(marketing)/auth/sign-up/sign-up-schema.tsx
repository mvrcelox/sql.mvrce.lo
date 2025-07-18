import z from "zod";

export type SignUpInput = z.input<typeof signUpSchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
export const signUpSchema = z.object({
   username: z.string().min(1, "Can't be blank").min(4, "Too small"),
   email: z.string({ required_error: "Can't be blank" }).min(1, "Can't be blank").email("Invalid email"),
});

export default signUpSchema;
