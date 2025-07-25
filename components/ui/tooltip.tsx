"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "@/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const TooltipRoot = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
   React.ElementRef<typeof TooltipPrimitive.Content>,
   React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
   <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
         ref={ref}
         sideOffset={sideOffset}
         className={cn(
            "text-background animate-in fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 !pointer-events-none z-50 overflow-hidden rounded-sm bg-neutral-800 px-2 py-1.5 text-xs tracking-normal shadow-md dark:bg-neutral-100",
            className,
         )}
         {...props}
      />
   </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider };

export const Tooltip = Object.assign(
   {},
   {
      Root: TooltipRoot,
      Trigger: TooltipTrigger,
      Content: TooltipContent,
      Provider: TooltipProvider,
   },
);
export default Tooltip;
