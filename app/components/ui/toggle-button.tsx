"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { ButtonProps, buttonVariants } from "@/app/components/ui/button";

export type ToggleProps = ButtonProps & React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>;

const Toggle = React.forwardRef<
   React.ElementRef<typeof TogglePrimitive.Root>,
   React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> & VariantProps<typeof buttonVariants>
>(({ className, intent, size, ...props }, ref) => (
   <TogglePrimitive.Root
      aria-disabled={props?.disabled || undefined}
      className={cn(buttonVariants({ intent, size, className }))}
      {...props}
      ref={ref}
   />
));

Toggle.displayName = TogglePrimitive.Root.displayName;

export { Toggle as default, Toggle };
