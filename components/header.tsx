"use client";

import dynamic from "next/dynamic";
import { SidebarIcon } from "@/components/sidebar";
import Button from "@/components/ui/button";
import { useOpen, useOpenToggle } from "@/contexts/open-context";
import { motion } from "motion/react";

const HeaderThemeToggle = dynamic(() => import("./header-theme-toggle"), { ssr: false });

export const Header = function () {
   return (
      <header className="linear-90 from-bg-white fixed top-0 z-10 mx-auto grid h-[5.75rem] w-full grid-cols-2 items-center justify-between to-transparent px-5 py-6">
         <div className="flex items-center justify-start gap-4">
            <ToggleSidebar />
         </div>
         {/* <div className="flex items-center justify-center">
            <motion.div
               initial={{ opacity: 0, scale: 0.8, y: 8, filter: "blur(2px)" }}
               animate={{ opacity: 1, scale: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
               exit={{ opacity: 0, scale: 0.7, y: -8, filter: "blur(3px)" }}
               transition={{ delay: 0.1, duration: 0.15 }}
            >
               <motion.span
                  whileHover={{ rotate: [-90, 0] }}
                  initial={{ rotate: 0 }}
                  animate={{ rotate: [-90, 0] }}
                  className={logoClassname}
               />
            </motion.div>
         </div> */}
         <div className="flex items-center justify-end gap-4">
            <HeaderThemeToggle />
         </div>
      </header>
   );
};

function ToggleSidebar() {
   const open = useOpen();
   const openToggle = useOpenToggle();

   return (
      <motion.div
         initial={{ opacity: 0, scale: 0.8, y: 8, filter: "blur(2px)" }}
         animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
         exit={{ opacity: 0, scale: 0.7, y: -8, filter: "blur(3px)" }}
      >
         <Button intent="ghost" size="icon" onClick={() => openToggle?.()}>
            <SidebarIcon open={open ?? false} />
         </Button>
      </motion.div>
   );
}
