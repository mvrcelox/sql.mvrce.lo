import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

export type TextAreaVariants = VariantProps<typeof textAreaVariants>;
export const textAreaVariants = cva(
   "flex min-h-[calc((20px*3)-2px)] h-[calc((20px*5)-2px)] text-sm w-full bg-transparent rounded-md transition-all placeholder:text-gray-400 outline-hidden disabled:cursor-not-allowed disabled:opacity-50 read-only:bg-gray-50",
   {
      variants: {
         intent: {
            none: null,
            primary:
               "bg-background caret-gray-800 border focus:border-primary outline-0 focus:outline-1 outline-border focus:outline-primary",
            gray: "bg-background caret-foreground border focus:border-foreground outline-0 focus:outline-1 outline-border focus:outline-foreground",
            opaque:
               "bg-gray-200 caret-foreground border border-gray-200 hover:bg-gray-300 hover:border-gray-300 focus:bg-background focus:outline-1 focus:outline-foreground focus:border-foreground outline-border ",
         },
         size: {
            none: null,
            sm: "min-h-[calc((20px*2)-2px)] h-[calc((20px*3)-2px)] p-2",
            md: "min-h-[calc((20px*3)-2px)] h-[calc((20px*4)-2px)] py-2 px-3",
            lg: "min-h-[calc((20px*4)-2px)] h-[calc((20px*6)-2px)] py-2 px-4",
         },
      },
      defaultVariants: {
         intent: "primary",
         size: "md",
      },
   },
);

const TextArea = React.forwardRef<
   HTMLTextAreaElement,
   Omit<React.ComponentProps<"textarea">, keyof TextAreaVariants> & TextAreaVariants
>(({ className, intent, size, ...props }, ref) => {
   return <textarea className={cn(textAreaVariants({ intent, size, className }))} {...props} ref={ref} />;
});
TextArea.displayName = "TextArea";

export { TextArea };
