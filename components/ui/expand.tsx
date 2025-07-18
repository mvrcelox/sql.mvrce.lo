"use client";

import React, { createContext, forwardRef, useContext } from "react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

import { cn } from "@/lib/utils";
import Toggle, { ToggleProps } from "@/components/ui/toggle-button";

interface RootProps {
   children?: React.ReactNode;
   defaultOpen?: boolean | undefined;
   open?: boolean | undefined;
   onOpenChange?: (open: boolean) => void;
}

interface ContentProps extends React.ComponentPropsWithoutRef<"div"> {
   forceMount?: boolean | undefined;
}

interface ContextProps {
   open: boolean;
   setOpen: (open: boolean) => void;
}

const Root = function ({ children, defaultOpen = false, open: propOpen, onOpenChange }: RootProps) {
   const [open, setOpen] = useControllableState<boolean>({
      defaultProp: defaultOpen,
      prop: propOpen,
      onChange: onOpenChange,
   });
   return <expandContext.Provider value={{ open: open ?? false, setOpen }}>{children}</expandContext.Provider>;
};

const Trigger = forwardRef<HTMLButtonElement, ToggleProps>(({ ...props }, ref) => {
   const { open, setOpen } = useContext(expandContext);
   return (
      <Toggle
         {...props}
         onPressedChange={(x) => {
            setOpen(x);
            props?.onPressedChange?.(x);
         }}
         pressed={open}
         ref={ref}
      />
   );
});
Trigger.displayName = "Trigger";

const Content = forwardRef<HTMLDivElement, ContentProps>(({ className, forceMount, ...props }, ref) => {
   const { open } = useContext(expandContext);
   if (!open && forceMount !== true) return null;

   return (
      <div
         aria-hidden={!open || undefined}
         aria-expanded={open || undefined}
         {...props}
         ref={ref}
         className={cn("flex flex-col aria-hidden:hidden", className)}
      />
   );
});
Content.displayName = "Content";

const expandContext = createContext<ContextProps>({} as ContextProps);
const Expand = {
   Root,
   Trigger,
   Content,
};

export default Expand;
