"use client";

import { buttonVariants } from "@/app/components/ui/button";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

export default function TableHeader() {
   const params = useParams();
   const pathname = usePathname();
   const [hover, setHover] = useState<number | null>(null);

   const endWithProperties = pathname.endsWith("properties");

   return (
      <LayoutGroup id="table-header">
         <div
            onMouseLeave={() => setHover(null)}
            className="isolate flex h-[calc(2.5rem+1px)] items-center border-b bg-transparent p-1"
         >
            <Link
               aria-selected={endWithProperties}
               onMouseEnter={() => setHover(0)}
               className={buttonVariants({
                  intent: "none",
                  size: "sm",
                  className: "hover:text-foreground group relative text-gray-600 aria-selected:text-gray-800",
               })}
               href={`/database/${params.databaseId}/table/${params.tableName}/properties`}
            >
               <AnimatePresence>
                  {hover === 0 ? (
                     <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layoutId="hover"
                        className="bg-background absolute inset-0 -z-10 size-full rounded-[inherit] border"
                        transition={{ type: "spring", duration: 0.2, bounce: 0.1 }}
                     />
                  ) : null}
               </AnimatePresence>
               {endWithProperties ? (
                  <motion.span
                     layoutId="selector"
                     className="bg-primary absolute inset-x-0 -bottom-1 z-10 size-full h-0.5 w-full"
                     transition={{ type: "spring", duration: 0.25, bounce: 0.2 }}
                  />
               ) : null}
               Properties
            </Link>

            <Link
               aria-selected={!endWithProperties}
               onMouseEnter={() => setHover(1)}
               className={buttonVariants({
                  intent: "none",
                  size: "sm",
                  className: "hover:text-foreground group relative text-gray-600 aria-selected:text-gray-800",
               })}
               href={`/database/${params.databaseId}/table/${params.tableName}`}
            >
               <AnimatePresence>
                  {hover === 1 ? (
                     <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        layoutId="hover"
                        className="bg-background absolute inset-0 -z-10 size-full rounded-[inherit] border"
                        transition={{ type: "spring", duration: 0.2, bounce: 0.1 }}
                     />
                  ) : null}
               </AnimatePresence>
               {!endWithProperties ? (
                  <motion.span
                     layoutId="selector"
                     className="bg-primary absolute inset-x-0 -bottom-1 z-10 size-full h-0.5 w-full"
                     transition={{ type: "spring", duration: 0.25, bounce: 0.2 }}
                  />
               ) : null}
               Data
            </Link>
         </div>
      </LayoutGroup>
   );
}
