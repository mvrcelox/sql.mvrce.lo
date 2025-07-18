"use client";

import { motion } from "motion/react";
import BadgeLogo from "@/components/badge-logo";
import { H1 } from "@/components/ui/texts";

export default function UnderConstruction() {
   return (
      <motion.div
         layoutId="under-construction-card"
         className="flex grow flex-col items-center justify-center gap-2 self-stretch"
      >
         <BadgeLogo />
         <section className="flex flex-col">
            <H1>We are sorry!</H1>
            <p className="text-center text-sm text-gray-700 md:text-base">This page is currently under construction.</p>
            <p className="text-center text-sm text-gray-700 md:text-base">Please check back later.</p>
         </section>
      </motion.div>
   );
}
