"use client";

import Button, { ButtonProps } from "@/components/ui/button";
import { toast } from "sonner";

export function ReadMoreButton({ ...props }: ButtonProps) {
   return (
      <Button
         intent={"outline"}
         {...props}
         onClick={() => {
            toast.warning("Not available yet.");
         }}
      >
         Read More
      </Button>
   );
}
