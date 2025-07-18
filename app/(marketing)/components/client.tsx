"use client";

import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import config from "@/config/site";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { Session } from "next-auth";
import Link from "next/link";

const slideUpVariants = {
   initial: { opacity: 0, scale: 0.95, y: 24 },
   animate: { opacity: 1, scale: 1, y: 0 },
   exit: { opacity: 0, scale: 0.9, y: -24 },
};

const title = "Access your databases with security.";
export function Title() {
   return (
      <motion.div
         initial="initial"
         animate="animate"
         exit="exit"
         transition={{ staggerChildren: 0.075 }}
         className="flex h-full w-full flex-wrap items-center justify-center md:flex-nowrap"
      >
         {title.split(" ").map((word, index) => (
            <p key={index} className="shrink-0 overflow-hidden">
               <motion.span className="inline-block" variants={slideUpVariants}>
                  {word}
               </motion.span>
               &nbsp;
            </p>
         ))}
      </motion.div>
   );
}

const description = "To anyone, at anywhere.";
export function Description({ className }: { className?: string }) {
   return (
      <motion.div
         initial="initial"
         animate="animate"
         exit="exit"
         transition={{ delayChildren: (title.split(" ").length + 1) * 0.075, staggerChildren: 0.05 }}
         className={cn("flex h-full w-full items-center justify-center", className)}
      >
         {description.split(" ").map((word, index) => (
            <p key={index} className="overflow-hidden">
               <motion.span className="inline-block" variants={slideUpVariants}>
                  {word}
               </motion.span>
               &nbsp;
            </p>
         ))}
      </motion.div>
   );
}

const getStartedVariants = {
   initial: { opacity: 0, y: 24, height: 0, marginTop: "0rem", pointerEvents: "none" as const },
   animate: { opacity: 1, y: 0, height: 48, marginTop: "1rem", pointerEvents: "unset" as const },
   exit: { opacity: 0, y: -24, height: 0, marginTop: "0rem", pointerEvents: "none" as const },
};

export function GetStarted({ session }: { session: Session | null }) {
   return (
      <motion.div
         initial="initial"
         animate="animate"
         exit="exit"
         className="flex items-center gap-2"
         variants={getStartedVariants}
         transition={{ delay: 1.2 }}
      >
         <Link
            href={session?.user ? "/dashboard" : "/auth/sign-in"}
            className={cn(
               buttonVariants({
                  intent: "primary",
                  size: "lg",
               }),
               "group gap-2 shadow-sm",
            )}
         >
            Let&apos;s access them
         </Link>
      </motion.div>
   );
}

export function LogoDiv() {
   return (
      <motion.div
         className="flex items-center justify-center gap-2"
         initial="hidden"
         animate="visible"
         exit="hidden"
         variants={{
            hidden: { opacity: 0, y: 24, height: 0, marginBottom: 0 },
            visible: { opacity: 1, y: 0, height: 24, marginBottom: 0 },
         }}
         transition={{ delay: 1.8 }}
      >
         <Logo />
         <span>{config.name}</span>
      </motion.div>
   );
}

export function Square({ className, delay = 0 }: { className?: string; delay?: number }) {
   return (
      <motion.span
         className={cn("repeat-infinite block size-5 shrink-0 bg-gray-200", className)}
         initial={{ opacity: 0, scale: 0.95, y: 24, rotateX: 20 }}
         animate={{ opacity: 1, scale: 1, y: 0, rotateX: [0] }}
         exit={{ opacity: 0, scale: 0.9 }}
         transition={{ duration: 0.4, delay: delay }}
      />
   );
}
