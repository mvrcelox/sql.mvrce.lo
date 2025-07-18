"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
   const { theme = "system" } = useTheme();

   return (
      <Sonner
         theme={theme as ToasterProps["theme"]}
         className="toaster group pointer-events-auto z-[100]"
         offset={16}
         toastOptions={{
            classNames: {
               toast: "group toast !bg-high-contrast !text-background !border-black group-[.toaster]:shadow-lg",
               success: "!bg-foreground !text-gray-50",
               warning: "!bg-yellow-500 !text-gray-950",
               error: "!bg-red-500 !text-gray-50",
               description: "group-[.toast]:text-gray-500",
               actionButton: "group-[.toast]:bg-gray-900 group-[.toast]:text-gray-50",
               cancelButton: "group-[.toast]:bg-gray-100 group-[.toast]:text-gray-500",
            },
         }}
         {...props}
      />
   );
};

export { Toaster };
