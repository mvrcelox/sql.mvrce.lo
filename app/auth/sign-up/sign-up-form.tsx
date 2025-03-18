"use client";

import { useForm, FormProvider } from "react-hook-form";
import { Input } from "@/app/components/ui/input";
import Button from "@/app/components/ui/button";
import Label from "@/app/components/ui/label";
import { MoveRight } from "lucide-react";

export default function SignUpForm() {
   const form = useForm();
   return (
      <FormProvider {...form}>
         <form className="flex w-full flex-col gap-2">
            <fieldset className="flex flex-col gap-0.5">
               <Label required>Username</Label>
               <Input autoComplete="username" />
            </fieldset>
            <fieldset className="flex flex-col gap-0.5">
               <Label required>E-mail</Label>
               <Input autoComplete="email" inputMode="email" />
            </fieldset>
            {/* <fieldset className="flex flex-col gap-0.5">
               <Label required>Password</Label>
               <Input />
            </fieldset> */}
            <Button intent="default" size="lg" className="gap-2 transition-[background,color,gap] hover:gap-1">
               Sign up <MoveRight className="size-4 shrink-0" />
            </Button>
         </form>
      </FormProvider>
   );
}
