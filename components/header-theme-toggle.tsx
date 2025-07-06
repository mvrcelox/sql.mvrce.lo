"use client";

import { useTheme } from "next-themes";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { Laptop, MoonStar, Sun } from "lucide-react";

import Button, { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const themes = [
   { value: "system", icon: Laptop },
   { value: "light", icon: Sun },
   { value: "dark", icon: MoonStar },
] as const;
interface Props extends React.ComponentPropsWithoutRef<"div"> {
   layoutGroupId?: string | undefined;
}
const MotionButton = motion.create(Button);
function HeaderThemeToggle({ layoutGroupId, className, ...props }: Props) {
   const [open, setOpen] = useState<boolean>(false);
   const { theme, setTheme, resolvedTheme } = useTheme();

   return (
      <LayoutGroup id={layoutGroupId}>
         <div aria-expanded={open} className={cn("group/container rounded-md p-1 leading-none", className)} {...props}>
            <Popover open={open} onOpenChange={setOpen}>
               <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 8, filter: "blur(2px)" }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.7, y: -8, filter: "blur(3px)", transition: { duration: 0.1 } }}
               >
                  <PopoverTrigger
                     className={cn(
                        buttonVariants({ intent: "ghost", size: "icon" }),
                        "size-9",
                        open ? "bg-gray-100" : "border-gray-200 duration-200 active:scale-[.98]",
                     )}
                     onClick={(e) => {
                        e.preventDefault();
                        if (open) return setOpen(false);
                        setTheme(resolvedTheme === "light" ? "dark" : "light");
                     }}
                     onMouseUp={(e) => {
                        if (e.button !== 2) return;
                        setOpen(!open);
                     }}
                     onContextMenu={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log(e.button);
                        if (e.button == -1) setOpen(!open);
                     }}
                  >
                     <AnimatePresence initial={false} mode="popLayout">
                        <motion.span
                           key={theme}
                           layoutId={theme}
                           className="size-5 shrink-0"
                           initial={{ scale: 0.9, opacity: 0.7, filter: "blur(1px)", rotate: 45 }}
                           animate={{ scale: 1, opacity: 1, filter: "blur(0px)", rotate: 0 }}
                           exit={{ scale: 0.9, opacity: 0.6, filter: "blur(1px)", rotate: -45 }}
                           transition={{ duration: 0.15 }}
                        >
                           {theme == "light" ? (
                              <Sun className="size-full" />
                           ) : theme === "dark" ? (
                              <MoonStar className="size-full" />
                           ) : (
                              <Laptop className="size-full" />
                           )}
                        </motion.span>
                     </AnimatePresence>
                  </PopoverTrigger>
               </motion.div>
               <AnimatePresence initial={false} mode="popLayout">
                  <PopoverContent align="start" className="w-auto border-none !bg-transparent p-0 shadow-none">
                     <motion.div
                        className="flex flex-col gap-1"
                        initial="hidden"
                        animate="visible"
                        transition={{ staggerChildren: 0.1 }}
                     >
                        {themes.toReversed().map(({ value, icon: Icon }) =>
                           theme === value ? null : (
                              <MotionButton
                                 key={value}
                                 intent="ghost"
                                 size="icon"
                                 variants={{
                                    hidden: { opacity: 0, y: -4, filter: "blur(2px)" },
                                    visible: { opacity: 1, y: 0, filter: "blur(0px)" },
                                 }}
                                 transition={{ duration: 0.15 }}
                                 onClick={() => {
                                    setTheme(value);
                                    setOpen(false);
                                 }}
                                 className="bg-background size-9 active:scale-[.98]"
                              >
                                 <motion.span
                                    layoutId={value}
                                    className="size-5 shrink-0"
                                    initial={{ scale: 0.9, opacity: 0, filter: "blur(1px)" }}
                                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                    exit={{ scale: 0.9, opacity: 0, filter: "blur(1px)" }}
                                 >
                                    <Icon className="size-5" />
                                 </motion.span>
                              </MotionButton>
                           ),
                        )}
                     </motion.div>
                  </PopoverContent>
               </AnimatePresence>
            </Popover>
            {/* <LayoutGroup id={layoutGroupId}>
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
         </LayoutGroup> */}
         </div>
      </LayoutGroup>
   );
}

export { HeaderThemeToggle, HeaderThemeToggle as default };
