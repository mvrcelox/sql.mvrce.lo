import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

export type InputVariants = VariantProps<typeof inputVariants>;
export const inputVariants = cva(
   "flex text-sm w-full bg-transparent rounded-md transition-colors placeholder:text-gray-400 outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
   {
      variants: {
         intent: {
            none: null,
            primary:
               "bg-background caret-gray-800 border focus:border-primary outline-0 focus:outline-1 outline-border focus:outline-primary",
            gray: "bg-background caret-foreground border focus:border-foreground outline-0 focus:outline-1 outline-border focus:outline-foreground",
            opaque: "bg-gray-100 caret-primary hover:bg-gray-200 focus:bg-gray-200 outline-none",
            opaque2:
               "bg-gray-100 caret-primary hover:bg-gray-200 focus:bg-gray-100 outline-none focus:outline-2 focus:outline-solid outline-offset-2 outline-primary aria-invalid:bg-red-100 dark:aria-invalid:bg-red-950",
            underline: "border-b-primary-hover border-b rounded-none",
         },
         size: {
            none: null,
            sm: "h-8 px-2",
            md: "h-10 px-3",
            lg: "h-12 px-4",
         },
      },
      defaultVariants: {
         intent: "gray",
         size: "md",
      },
   },
);

const Input = React.forwardRef<
   HTMLInputElement,
   Omit<React.ComponentProps<"input">, keyof InputVariants> & InputVariants
>(({ className, intent, size, ...props }, ref) => {
   return <input className={cn(inputVariants({ intent, size, className }))} {...props} ref={ref} />;
});
Input.displayName = "Input";

export { Input };
