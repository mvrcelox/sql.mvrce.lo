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

const sizes = {
   xs: "size-6",
   sm: "size-7 p-1",
   md: "size-8 p-1",
   lg: "size-9",
   xl: "size-10",
};

interface Props extends React.ComponentPropsWithoutRef<"div"> {
   layoutGroupId?: string | undefined;
   size?: keyof typeof sizes;
}
function ThemeToggle({ layoutGroupId, className, size = "md", ...props }: Props) {
   const { theme: currentTheme, setTheme } = useTheme();

   return (
      <div
         data-size={size}
         className={cn("group/container overflow-hidden rounded-lg border bg-gray-100 p-1 leading-none", className)}
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
                     className={cn("aria-selected:text-foreground relative !bg-transparent", sizes[size])}
                     onClick={() => setTheme(theme.value)}
                  >
                     {isSelected ? (
                        <motion.span
                           transition={{ duration: 0.15 }}
                           layoutId="theme-toggle-selector"
                           className="bg-background absolute inset-0 block h-full w-full rounded-[inherit] border"
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

export { ThemeToggle, ThemeToggle as default };
