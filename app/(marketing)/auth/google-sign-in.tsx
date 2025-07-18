"use client";

import { signIn } from "next-auth/react";

import Button from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import GoogleIcon from "@/components/icons/google-icon";

export default function GoogleSignIn() {
   const { mutate, isPending } = useMutation({
      mutationKey: ["sign-in-google"],
      mutationFn: async () => {
         const response = await signIn("google", {
            redirect: true,
            callbackUrl: "/dashboard",
         });
         if (response?.ok == false) {
            toast.error(response.error ?? "Service error");
         }
      },
   });

   return (
      <Button
         disabled={isPending}
         intent="fillup"
         className="xs:grow xs:basis-0 relative shrink gap-2"
         onClick={() => mutate()}
      >
         {isPending ? <Loader2 className="size-5 shrink-0 animate-spin" /> : <GoogleIcon className="size-5 shrink-0" />}
         Google
      </Button>
   );
}
