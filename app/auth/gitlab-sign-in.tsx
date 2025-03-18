"use client";

import { signIn } from "next-auth/react";

import Button from "@/app/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import GitlabIcon from "../components/icons/gitlab-icon";

export default function GitlabSignIn() {
   const { mutate, isPending } = useMutation({
      mutationKey: ["sign-in-gitlab"],
      mutationFn: async () => {
         const response = await signIn("gitlab", {
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
         intent="outline"
         className="xs:grow xs:basis-0 relative shrink gap-2"
         onClick={() => mutate()}
      >
         {isPending ? <Loader2 className="size-5 shrink-0 animate-spin" /> : <GitlabIcon className="size-5 shrink-0" />}
         Gitlab
      </Button>
   );
}
