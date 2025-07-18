"use client";

import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import Label from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import signUpSchema, { SignUpSchema } from "./sign-up-schema";
import { useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function SignUpForm() {
   const form = useForm<SignUpSchema>({
      resolver: zodResolver(signUpSchema),
   });

   const {
      handleSubmit,
      register,
      formState: { errors },
   } = form;

   const onSubmit = useCallback((data: SignUpSchema) => {
      console.log(data);
   }, []);

   return (
      <FormProvider {...form}>
         <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit(onSubmit, console.error)}>
            <fieldset className="flex flex-col gap-1.5">
               <Label required htmlFor="username">
                  Username
               </Label>
               <Input
                  intent="opaque2"
                  autoComplete="username"
                  placeholder="JohnDoe"
                  id="username"
                  {...register("username")}
               />
               <AnimatePresence>
                  {errors.username?.message ? (
                     <motion.div
                        initial={{ height: "0rem", opacity: 0 }}
                        animate={{ height: "1rem", opacity: 1 }}
                        exit={{ height: "0rem", opacity: 0 }}
                        hidden={!errors.username?.message}
                        transition={{ duration: 0.15 }}
                     >
                        <motion.span
                           key={errors.username.message?.toString()}
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
                           {errors.username.message?.toString()}
                        </motion.span>
                     </motion.div>
                  ) : null}
               </AnimatePresence>
            </fieldset>
            <fieldset className="flex flex-col gap-1.5">
               <Label required htmlFor="email">
                  E-mail
               </Label>
               <Input
                  intent="opaque2"
                  autoComplete="username webauthn"
                  inputMode="email"
                  placeholder="john@acme.com"
                  id="email"
                  {...register("username")}
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
               Create account
            </Button>
         </form>
      </FormProvider>
   );
}
