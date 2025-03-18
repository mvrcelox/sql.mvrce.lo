"use client";

import { useTheme } from "next-themes";
import { LayoutGroup, motion } from "motion/react";
import { Laptop, MoonStar, Sun } from "lucide-react";

import Button from "@/app/components/ui/button";
import { cn } from "@/lib/utils";

const themes = [
   { value: "system", icon: Laptop },
   { value: "light", icon: Sun },
   { value: "dark", icon: MoonStar },
] as const;

const sizes = {
   xs: "size-6",
   sm: "size-7",
   md: "size-8",
   lg: "size-9",
   xl: "size-10",
};

interface Props extends React.ComponentPropsWithoutRef<"div"> {
   layoutGroupId?: string | undefined;
   size?: keyof typeof sizes;
}
export const ThemeToggle = ({ layoutGroupId, className, size = "md", ...props }: Props) => {
   const { theme: currentTheme, setTheme } = useTheme();

   return (
      <div className={cn("bg-rgb-50 overflow-hidden border leading-none", className)} {...props}>
         <LayoutGroup id={layoutGroupId}>
            {themes.map((theme) => {
               const Icon = theme.icon;
               const isSelected = theme.value === currentTheme;

               return (
                  <Button
                     key={theme.value}
                     aria-selected={isSelected || undefined}
                     intent="ghost"
                     size="icon"
                     className={cn(
                        "aria-selected:text-foreground relative h-full rounded-none !bg-transparent",
                        sizes[size],
                     )}
                     onClick={() => setTheme(theme.value)}
                  >
                     {isSelected ? (
                        <motion.span
                           transition={{ duration: 0.15 }}
                           layoutId="theme-toggle-selector"
                           className="absolute inset-0 block h-full w-full bg-gray-200"
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
};
