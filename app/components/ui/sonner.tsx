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
               success: "!bg-foreground !text-neutral-50",
               warning: "!bg-yellow-500 !text-neutral-950",
               error: "!bg-red-500 !text-neutral-50",
               description: "group-[.toast]:text-zinc-500 dark:group-[.toast]:text-zinc-400",
               actionButton:
                  "group-[.toast]:bg-zinc-900 group-[.toast]:text-zinc-50 dark:group-[.toast]:bg-zinc-50 dark:group-[.toast]:text-zinc-900",
               cancelButton:
                  "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-500 dark:group-[.toast]:bg-zinc-800 dark:group-[.toast]:text-zinc-400",
            },
         }}
         {...props}
      />
   );
};

export { Toaster };
