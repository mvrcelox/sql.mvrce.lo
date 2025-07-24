"use client";

import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Gauge, Loader2, Search, Table2, Terminal } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { TooltipRoot, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { UserRound, Bolt, LogOut } from "lucide-react";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation } from "@tanstack/react-query";
import { signOut, useSession } from "next-auth/react";
import { useSessionStorage } from "@uidotdev/usehooks";
import CommandMenu from "./command-menu";
import SidebarThemeSelector from "./sidebar-theme-selector";

const sections = [
   [{ href: "/dashboard", label: "Dashboard", icon: Gauge, toggle: false }],
   [
      { href: "/database", label: "Databases", icon: Table2, toggle: true },
      { href: "/sql-editor", label: "SQL Terminal", icon: Terminal, toggle: false },
      { href: "/search-engine", label: "Search Everywhere", icon: Search, toggle: false },
   ],
] as const;

const sidebarAnimationDuration = 0.2;
function Sidebar() {
   const pathname = usePathname();
   const isCurrentPath = (href: string) => {
      return pathname.startsWith(href.split("/*")?.[0] ?? "");
   };

   const [hide, setHide] = useSessionStorage<boolean>("sub-sidebar", false);

   return (
      <motion.aside
         initial={{ marginLeft: -45 }}
         animate={{ marginLeft: 0 }}
         exit={{ marginLeft: -45 }}
         transition={{
            type: "tween",
            ease: "circInOut",
            duration: sidebarAnimationDuration,
         }}
         className="sticky top-0 z-[3] flex w-[calc(2.75rem+1px)] flex-col self-stretch md:w-[calc(3rem+1px)]"
      >
         {/* <div className="bg-background grid max-h-[calc(2.5rem+1px)] place-items-center border-b py-2">
            <Logo className="size-6" />
         </div> */}

         <nav className="flex shrink-0 grow flex-col gap-2 self-stretch p-1">
            <TooltipProvider delayDuration={0} skipDelayDuration={0} disableHoverableContent>
               {sections.map((section, idx) => {
                  return (
                     <div key={idx} className="flex flex-col gap-1 self-stretch">
                        {section.map((nav) => {
                           const isActive = isCurrentPath(nav.href);
                           return (
                              <TooltipRoot key={nav.href}>
                                 <TooltipTrigger asChild>
                                    <Link
                                       href={nav.href}
                                       aria-selected={isActive || undefined}
                                       onClick={(e) => {
                                          if (!isActive || !nav.toggle) return;
                                          e.preventDefault();
                                          setHide(!hide);
                                       }}
                                       className={cn([
                                          "group aria-selected:text-primary aria-selected:hover:text-primary-hover relative isolation-auto grid aspect-square place-items-center rounded-md text-gray-600 hover:text-gray-800",
                                       ])}
                                    >
                                       <AnimatePresence>
                                          {isActive && (
                                             <motion.span
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                layoutId="sidebar-hover-selector"
                                                className="bg-primary/20 pointer-events-none absolute inset-0 -z-10 size-full rounded-md shadow-xs"
                                                transition={{ type: "spring", duration: 0.15, bounce: 0.2 }}
                                             />
                                          )}
                                       </AnimatePresence>

                                       <nav.icon className="size-5 group-active:scale-95" strokeWidth={2} />
                                       <span className="sr-only">{nav.label}</span>
                                    </Link>
                                 </TooltipTrigger>
                                 <TooltipContent side="right" className="!pointer-events-none">
                                    {nav.label}
                                 </TooltipContent>
                              </TooltipRoot>
                           );
                        })}
                     </div>
                  );
               })}
            </TooltipProvider>

            <span role="separator" tabIndex={-1} aria-label="spacement" className="grow self-stretch" />
            <SidebarUser />
         </nav>
         <CommandMenu />
      </motion.aside>
   );
}

function SidebarUser() {
   const { data: session } = useSession();

   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button
               intent="ghost"
               size="icon"
               className="size-9 text-gray-500 hover:bg-gray-200 hover:text-gray-700 aria-expanded:bg-gray-200 aria-expanded:shadow-inner md:size-10"
            >
               <UserRound className="size-5" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent side="top">
            <div className="flex items-center gap-2 p-1">
               {session?.user?.image ? (
                  <span
                     className="block size-8 rounded bg-contain"
                     style={{ backgroundImage: `url(${session?.user?.image})` }}
                  />
               ) : (
                  <span className="block size-8 rounded bg-gray-200" />
               )}
               <div className="flex flex-col">
                  <div className="text-foreground text-sm">{session?.user?.name ?? "Your username"}</div>
                  <div className="text-xs text-gray-500">{session?.user?.email ?? "example@email.com"}</div>
               </div>
            </div>
            <DropdownMenuSeparator />

            <div className="flex items-center justify-between gap-4 py-0.5 pl-2">
               <span className="text-sm text-gray-700">Theme</span>
               <SidebarThemeSelector />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2" asChild>
               <Link href={`/settings/me`}>
                  Account settings
                  <Bolt className="ml-auto size-4 shrink-0 opacity-70" />
               </Link>
            </DropdownMenuItem>
            <SignOutButton />
            <DropdownMenuSeparator />
            <div className="p-1">
               <Button intent="default" size="none" className="w-full rounded px-2 py-1.5">
                  Upgrade to pro!
               </Button>
            </div>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}

function SignOutButton() {
   const { mutate, isPending } = useMutation({
      mutationKey: ["sign-out"],
      mutationFn: async () => await signOut({ redirect: true, redirectTo: "/auth/sign-in" }),
   });

   return (
      <DropdownMenuItem
         disabled={isPending}
         className="gap-2"
         onClick={(e) => {
            e.preventDefault();
            mutate();
         }}
      >
         Log out
         {isPending ? (
            <Loader2 className="ml-auto size-4 shrink-0 animate-spin opacity-70" />
         ) : (
            <LogOut className="ml-auto size-4 shrink-0 opacity-70" />
         )}
      </DropdownMenuItem>
   );
}

export function SidebarTrigger({ className }: { className?: string }) {
   const [open, setOpen] = useState<boolean>(false);

   return (
      <Button
         aria-expanded={open || undefined}
         intent="ghost"
         size="icon"
         className={cn("group relative flex size-8 flex-col", className)}
         onClick={() => {
            setOpen((prev) => !prev);
         }}
      >
         <SidebarIcon open={open} />
      </Button>
   );
}

export function SidebarIcon({ open }: { open: boolean }) {
   return (
      <div className="relative grid size-5">
         <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-panel-left-icon lucide-panel-left relative size-full text-[inherit]"
         >
            <rect width="20" height="16" x="2" y="4" rx="3" />
         </svg>
         {open ? (
            <motion.div
               layoutId="sidebar-open-indicator"
               animate={{ opacity: 1 }}
               transition={{ type: "spring", duration: 0.2, bounce: 0 }}
               className="absolute top-[3px] bottom-[3px] left-[7px] w-[2px] rounded-full bg-current text-[inherit]"
            />
         ) : (
            <motion.div
               animate={{ opacity: 0.7 }}
               layoutId="sidebar-open-indicator"
               transition={{ type: "spring", duration: 0.35, bounce: 0.35 }}
               className="absolute top-[5px] bottom-[5px] left-[4px] w-[2px] rounded-full bg-current text-[inherit] transition-colors"
            />
         )}
      </div>
   );
}

export function SidebarMobileIcon({ open }: { open: boolean }) {
   return (
      <div className="relative grid size-5">
         <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-panel-left-icon lucide-panel-left relative size-full text-[inherit]"
         >
            <rect width="16" height="20" x="4" y="2" rx="3" />
         </svg>
         <motion.div
            layoutId="sidebar-open-indicator"
            animate={{
               left: open ? 3 : 5,
               right: open ? 3 : 5,
               bottom: open ? 10 : 4,
               opacity: open ? 1 : 0.7,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="absolute h-[2px] rounded-full bg-current text-[inherit]"
         />
         {/* {open ? (
            
         ) : (
            <motion.div
               animate={{ opacity: 0.7 }}
               layoutId="sidebar-open-indicator"
               transition={{ type: "spring", duration: 0.35, bounce: 0.35 }}
               className="absolute right-[5px] bottom-[4px] left-[5px] h-[2px] rounded-full bg-current text-[inherit] transition-colors"
            />
         )} */}
      </div>
   );
}

export { Sidebar, Sidebar as default };
