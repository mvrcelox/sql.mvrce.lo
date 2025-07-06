"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
   return (
      <SwitchPrimitive.Root
         data-slot="switch"
         className={cn(
            "peer data-[state=checked]:active:bg-primary-hover data-[state=checked]:bg-primary focus-visible:outline-primary inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full outline-offset-2 transition-[background,box-shadow] focus-visible:border-gray-950 focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=unchecked]:bg-gray-300 data-[state=unchecked]:shadow-inner data-[state=unchecked]:active:bg-gray-400",
            className,
         )}
         {...props}
      >
         <SwitchPrimitive.Thumb
            data-slot="switch-thumb"
            className={cn(
               "bg-background pointer-events-none block size-4 rounded-full shadow-sm transition-transform data-[state=checked]:translate-x-4.5 data-[state=unchecked]:translate-x-0.5",
            )}
         />
      </SwitchPrimitive.Root>
   );
}

export { Switch };
