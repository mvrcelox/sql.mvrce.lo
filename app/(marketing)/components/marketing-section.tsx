"use client";

import { useOpen } from "@/contexts/open-context";
import { motion } from "motion/react";
import { SIDEBAR_ENTRANCE_DURATION, SIDEBAR_EXIT_DURATION, SIDEBAR_SIZE } from "./constants";

export default function MarketingSection({ children }: React.PropsWithChildren) {
   const open = useOpen();

   const translateX = !open ? 0 : SIDEBAR_SIZE;
   return (
      <motion.section
         layout
         initial={{ translateX: 0 }}
         animate={{ translateX }}
         transition={{ type: "spring", duration: open ? SIDEBAR_ENTRANCE_DURATION : SIDEBAR_EXIT_DURATION, bounce: 0 }}
         className="flex grow flex-col px-5 py-6"
      >
         {children}
      </motion.section>
   );
}
