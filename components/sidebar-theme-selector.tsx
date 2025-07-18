"use client";

import { useTheme } from "next-themes";
import { LayoutGroup, motion } from "motion/react";
import { Laptop, MoonStar, Sun } from "lucide-react";

import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";

const themes = [
   { value: "system", icon: Laptop },
   { value: "light", icon: Sun },
   { value: "dark", icon: MoonStar },
] as const;

interface Props extends React.ComponentPropsWithoutRef<"div"> {
   layoutGroupId?: string | undefined;
}
function SidebarThemeSelector({ layoutGroupId, className, ...props }: Props) {
   const { theme: currentTheme, setTheme } = useTheme();

   return (
      <div
         data-slot="theme-selector"
         className={cn("group/container overflow-hidden rounded-md bg-gray-200 p-0.5 leading-none", className)}
         {...props}
      >
         <LayoutGroup id={layoutGroupId}>
            {themes.map((theme) => {
               const Icon = theme.icon;
               const isSelected = theme.value === currentTheme;

               return (
                  <Button
                     suppressHydrationWarning
                     key={theme.value}
                     aria-selected={isSelected || false}
                     intent="ghost"
                     size="icon"
                     className={cn("aria-selected:text-foreground relative size-6 !bg-transparent text-gray-600")}
                     onClick={() => setTheme(theme.value)}
                  >
                     {isSelected ? (
                        <motion.span
                           transition={{ duration: 0.15 }}
                           layoutId="theme-selector"
                           className="bg-background absolute inset-0 block h-full w-full rounded shadow-xs"
                        />
                     ) : null}
                     <span className="sr-only">
                        {theme.value}
                        {isSelected ? "/selected" : null}
                     </span>
                     <Icon className="relative z-[1] size-4 shrink-0" />
                  </Button>
               );
            })}
         </LayoutGroup>
      </div>
   );
}

export { SidebarThemeSelector, SidebarThemeSelector as default };
