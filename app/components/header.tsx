"use client";

import { SidebarTrigger } from "@/app/components/sidebar";
import { buttonVariants } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useState } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";
import { Logo } from "@/app/components/ui/logo";
import exportAsClient from "@/lib/export-as-client";

const links = [
   { label: "Home", href: "/" },
   { label: "About", href: "/about" },
];

export const Header = exportAsClient(
   function () {
      const isTablet = useMediaQuery("(min-width : 768px)");
      const [activeLink, setActiveLink] = useState<(typeof links)[number] | null>(null);

      return (
         <header className="sticky top-0 flex h-[4.5rem] w-full items-center justify-between p-4">
            <div className="flex items-center gap-4">
               <Link
                  href="#"
                  className={cn(
                     buttonVariants({
                        intent: "ghost",
                        className: "text-foreground cursor-pointer text-base",
                     }),
                  )}
               >
                  <Logo className="mr-2 size-5" />
                  <span className="font-semibold">mvrcelo</span>
               </Link>
               {isTablet ? (
                  <nav className="flex items-center" onMouseLeave={() => setActiveLink(null)}>
                     <LayoutGroup id="nav">
                        {links.map((link) => (
                           <Link
                              key={link.href}
                              href={link.href}
                              aria-selected={activeLink === link ? true : undefined}
                              onMouseEnter={() => setActiveLink(link)}
                              className={buttonVariants({
                                 intent: "ghost",
                                 size: "sm",
                                 className:
                                    "group relative h-[1.875rem] gap-2 bg-transparent px-3 hover:bg-transparent",
                              })}
                           >
                              <AnimatePresence>
                                 {activeLink === link ? (
                                    <motion.div
                                       initial={{ opacity: 0 }}
                                       animate={{ opacity: 1 }}
                                       exit={{ opacity: 0 }}
                                       transition={{
                                          type: "spring",
                                          duration: 0.15,
                                          bounce: 0.2,
                                       }}
                                       layoutId="active"
                                       className="absolute inset-0 -z-10 rounded-[inherit] bg-gray-200"
                                    />
                                 ) : null}
                              </AnimatePresence>
                              {link.label}
                              {/* <ChevronDown className="size-4" /> */}
                           </Link>
                        ))}
                     </LayoutGroup>
                  </nav>
               ) : null}
            </div>
            <div className="flex items-center">
               {/* <Button aria-expanded={undefined} intent="ghost" className="flex flex-col size-10 gap-0.5 relative group">
					<div className="relative w-5 h-[17px] shrink-0 [&>svg]:w-5 [&>svg]:absolute">
						{Icons.BellBehind}
						{Icons.BellOverlay}
					</div>
					<div className="shrink-0 [&>svg]:h-1">{Icons.BellRing}</div>
					<span className="bg-primary size-2.5 absolute top-2 left-5 rounded-full z-10" />
				</Button> */}
               {/* <Notifications /> */}
               {isTablet ? null : <SidebarTrigger className="" />}
            </div>
         </header>
      );
   },
   () => (
      <header className="sticky top-0 flex h-[4.5rem] w-full items-center justify-between p-4">
         <div className="flex items-center gap-4">
            <Link
               href="#"
               className={cn(
                  buttonVariants({
                     intent: "ghost",
                     className: "text-foreground cursor-pointer text-base",
                  }),
               )}
            >
               <Logo className="mr-2 size-5" />
               <span className="font-semibold">mvrcelo</span>
            </Link>
         </div>
      </header>
   ),
);
