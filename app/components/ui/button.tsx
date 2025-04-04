import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

type ButtonVariants = VariantProps<typeof buttonVariants>;
const buttonVariants = cva(
   "inline-flex items-center rounded-md justify-center whitespace-nowrap text-sm font-medium cursor-pointer outline-hidden focus-visible:outline-2 transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
   {
      variants: {
         intent: {
            none: null,
            default: "bg-gray-900 text-background hover:bg-gray-900/90",
            primary: "bg-primary hover:bg-primary-hover text-neutral-50 outline-foreground",
            destructive:
               "bg-red-600 text-gray-50 hover:bg-rose-700 dark:bg-red-600 dark:hover:bg-red-500 outline-red-500",
            outline:
               "bg-background focus-visible:!border-transparent border border-border text-gray-700 hover:border-gray-400 hover:bg-gray-100 hover:text-foreground outline-foreground",
            secondary:
               "bg-gray-100 text-gray-900 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-50 dark:hover:bg-gray-800/80",
            ghost: "text-gray-700 hover:bg-gray-200 hover:text-foreground outline-foreground focus-visible:bg-gray-200",
            link: "text-gray-700 underline-offset-2 hover:text-foreground",
         },
         size: {
            none: null,
            xs: "h-7 px-2",
            sm: "h-8 px-3",
            md: "h-10 px-4 py-2",
            lg: "h-12 px-8",
            icon: "size-10",
         },
      },
      defaultVariants: {
         intent: "default",
         size: "md",
      },
   },
);

export interface ButtonProps
   extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonVariants>,
      ButtonVariants {
   asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
   ({ className, type = "button", intent, size, asChild = false, ...props }, ref) => {
      const Comp = asChild ? Slot : "button";
      return <Comp type={type} {...props} className={cn(buttonVariants({ intent, size, className }))} ref={ref} />;
   },
);
Button.displayName = "Button";

export { Button as default, Button, buttonVariants };
