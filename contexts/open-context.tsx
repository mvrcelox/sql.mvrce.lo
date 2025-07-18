"use client";

// MyContext.tsx
import { createContext, useContext } from "react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

interface Props {
   children: React.ReactNode;
   defaultOpen?: boolean;
   onOpenChange?: (open: boolean) => void;
   open?: boolean | undefined;
}

interface State {
   open: boolean;
   toggle: (open?: boolean) => void;
}

const openContext = createContext<State | null>(null);

export const OpenProvider = ({ defaultOpen: defaultProp, open: prop, onOpenChange: onChange, ...props }: Props) => {
   const [open, setOpen] = useControllableState<boolean>({
      defaultProp: defaultProp ?? false,
      prop: prop,
      onChange,
   });
   const toggle = (open?: boolean | undefined) => setOpen((o) => open ?? !o);

   return <openContext.Provider value={{ open, toggle }} {...props} />;
};

// Hooks com seletor:

// export const useOpen = () => useContextSelector(openContext, (ctx) => ctx?.open ?? false);

export const useOpen = () => useContext(openContext)?.open;

// export const useOpenToggle = () => useContextSelector(openContext, (ctx) => ctx?.toggle);

export const useOpenToggle = () => useContext(openContext)?.toggle;
