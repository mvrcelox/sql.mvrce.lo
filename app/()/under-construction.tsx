"use client";

import { motion } from "motion/react";
import BadgeLogo from "../components/badge-logo";

export default function UnderConstruction() {
   return (
      <motion.div
         layoutId="under-construction-card"
         className="flex grow flex-col items-center justify-center gap-2 self-stretch"
      >
         <BadgeLogo />
         <section className="flex flex-col">
            <h1 className="text-foreground mb-2 text-center text-2xl font-semibold md:mb-4 md:text-3xl">
               We are sorry!
            </h1>
            <p className="text-center text-sm text-gray-700 md:text-base">This page is currently under construction.</p>
            <p className="text-center text-sm text-gray-700 md:text-base">Please check back later.</p>
         </section>
      </motion.div>
   );
}
