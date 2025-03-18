"use client";

import { Snail, WifiOff, X } from "lucide-react";
import { useNetworkState } from "@uidotdev/usehooks";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Button from "@/app/components/ui/button";

export function NetworkStatus() {
   const [closed, setClosed] = useState(false);
   const network = useNetworkState();

   useEffect(() => {
      if (!closed) return;
      setClosed(false);
   }, [network.online]);

   return (
      <>
         <AnimatePresence>
            {closed ? null : network.online ? (
               network.downlink && network.downlink < 2 ? (
                  <motion.div
                     key={"slow-internet"}
                     initial={{ opacity: 0, transform: "translateY(100%)" }}
                     animate={{ opacity: 1, transform: "translateY(0%)" }}
                     exit={{ opacity: 0, transform: "translateY(100%)" }}
                     transition={{
                        opacity: { duration: 0.15 },
                        transform: {
                           type: "spring",
                           duration: 0.25,
                           bounce: 0.2,
                        },
                     }}
                     className={cn(
                        "border-ds-amber-400 bg-ds-amber-200 text-ds-amber-900 hover:border-ds-amber-500 hover:bg-ds-amber-300 fixed bottom-[--gap] left-[--gap] flex items-center gap-2 rounded-full border p-1.5 [--gap:0.5rem] sm:px-3.5 md:[--gap:1rem]",
                        network.online ? null : "mb-[2.625rem]",
                     )}
                  >
                     <Snail className="size-5 shrink-0" />
                     <span className="text-sm max-sm:hidden">Slow internet</span>
                     <Button
                        intent="none"
                        size="none"
                        className="hover:bg-ds-amber-400 active:bg-ds-amber-500 -m-0.5 -mr-2 rounded-full p-1"
                        onClick={() => setClosed(true)}
                     >
                        <X className="size-4" />
                     </Button>
                  </motion.div>
               ) : null
            ) : (
               <motion.div
                  key={"no-internet"}
                  initial={{ opacity: 0, transform: "translateY(100%)" }}
                  animate={{ opacity: 1, transform: "translateY(0%)" }}
                  exit={{ opacity: 0, transform: "translateY(100%)" }}
                  transition={{
                     opacity: { duration: 0.15 },
                     transform: {
                        type: "spring",
                        duration: 0.25,
                        bounce: 0.2,
                     },
                  }}
                  className="border-ds-red-400 bg-ds-red-200 text-ds-red-900 hover:border-ds-red-500 hover:bg-ds-red-300 fixed bottom-[--gap] left-[--gap] flex items-center gap-2 rounded-full border p-1.5 [--gap:0.5rem] sm:px-3.5 md:[--gap:1rem]"
               >
                  <WifiOff className="size-5 shrink-0" />
                  <span className="text-sm max-sm:hidden">Offline</span>
                  <Button
                     intent="none"
                     size="none"
                     className="hover:bg-ds-red-400 active:bg-ds-red-500 -m-0.5 -mr-2 rounded-full p-1"
                     onClick={() => setClosed(true)}
                  >
                     <X className="size-4" />
                  </Button>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   );
}

export default NetworkStatus;
