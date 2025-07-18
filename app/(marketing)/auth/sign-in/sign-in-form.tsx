"use client";

import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import Label from "@/components/ui/label";
import signInSchema, { SignInSchema } from "./sign-in-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function SignInForm() {
   const form = useForm<SignInSchema>({
      resolver: zodResolver(signInSchema),
   });

   const {
      handleSubmit,
      register,
      formState: { errors },
   } = form;

   const onSubmit = useCallback((data: SignInSchema) => {
      console.log(data);
   }, []);

   return (
      <FormProvider {...form}>
         <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit(onSubmit, console.error)}>
            <fieldset className="flex flex-col gap-1.5">
               <Label required htmlFor="">
                  E-mail
               </Label>
               <Input
                  intent="opaque2"
                  autoComplete="username webauthn"
                  spellCheck="false"
                  inputMode="email"
                  placeholder="john@acme.com"
                  {...register("email")}
                  className="pr-16"
               />
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
               Let&apos; sign in
            </Button>
         </form>
      </FormProvider>
   );
}
