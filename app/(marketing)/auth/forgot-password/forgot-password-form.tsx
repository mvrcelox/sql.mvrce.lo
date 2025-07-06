"use client";

import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import Label from "@/components/ui/label";
import forgotPasswordSchema, { ForgotPasswordSchema } from "./forgot-password-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function SignInForm() {
   const form = useForm<ForgotPasswordSchema>({
      resolver: zodResolver(forgotPasswordSchema),
   });

   const {
      handleSubmit,
      register,
      formState: { errors },
   } = form;

   const onSubmit = useCallback((data: ForgotPasswordSchema) => {
      console.log(data);
   }, []);

   return (
      <FormProvider {...form}>
         <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit(onSubmit, console.error)}>
            <fieldset className="flex flex-col gap-1.5">
               <Label required htmlFor="">
                  E-mail
               </Label>
               <div className="relative">
                  <Input
                     intent="opaque2"
                     autoComplete="username webauthn"
                     spellCheck="false"
                     inputMode="email"
                     placeholder="john@acme.com"
                     {...register("email")}
                     className="pr-16"
                  />
                  <span className="absolute top-1/2 right-3 block -translate-y-1/2 rounded-sm text-xs text-gray-400">
                     {"[ENTER]"}
                  </span>
               </div>

               <AnimatePresence>
                  {errors.email?.message ? (
                     <motion.div
                        initial={{ height: "0rem", opacity: 0 }}
                        animate={{ height: "1rem", opacity: 1 }}
                        exit={{ height: "0rem", opacity: 0 }}
                        hidden={!errors.email?.message}
                        transition={{ duration: 0.15 }}
                     >
                        <motion.span
                           key={errors.email.message?.toString()}
                           initial={{
                              y: -4,
                              filter: "blur(2px)",
                           }}
                           animate={{
                              y: 0,
                              filter: "blur(0px)",
                           }}
                           exit={{
                              y: 4,
                              filter: "blur(2px)",
                           }}
                           transition={{ duration: 0.15 }}
                           className="block text-xs text-red-500"
                        >
                           {errors.email.message?.toString()}
                        </motion.span>
                     </motion.div>
                  ) : null}
               </AnimatePresence>
            </fieldset>
            <Button
               type="submit"
               intent="primary"
               size="lg"
               className="gap-2 transition-[background,color,gap] hover:gap-1"
            >
               Send reset link
            </Button>
         </form>
      </FormProvider>
   );
}
