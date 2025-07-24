"use client";

import { buttonVariants } from "@/components/ui/button";
import { Database, Loader2, LucideIcon, Waypoints } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Link, { useLinkStatus } from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";

interface Route {
   slug: string;
   label: string;
   href: (params: { id: string; table: string }) => string;
   icon?: LucideIcon;
}
const ROUTES: Route[] = [
   {
      slug: "structure",
      icon: Waypoints,
      label: "Structure",
      href: ({ id, table }: { id: string; table: string }) => `/databases/${id}/table/${table}/properties`,
   },
   {
      slug: "data",
      icon: Database,
      label: "Data",
      href: ({ id, table }: { id: string; table: string }) => `/databases/${id}/table/${table}`,
   },
];

export default function TableHeader() {
   const params = useParams<{ id: string; table: string }>();
   const pathname = usePathname();
   const [hover, setHover] = useState<number | null>(null);

   return (
      <LayoutGroup id="table-header">
         <div
            onMouseLeave={() => setHover(null)}
            className="isolate flex h-[calc(2.5rem+1px)] items-center bg-transparent p-1"
         >
            {ROUTES.map((route, index) => {
               const href = route.href(params);
               const isSelected = pathname === route.href(params);
               return (
                  <Link
                     key={route.slug}
                     aria-selected={isSelected}
                     href={href}
                     onMouseEnter={() => setHover(index)}
                     className={buttonVariants({
                        intent: "none",
                        size: "sm",
                        className:
                           "hover:text-foreground group relative gap-2 text-gray-600 aria-selected:text-gray-800",
                     })}
                  >
                     {route.icon && <route.icon className="-ml-1 size-4 opacity-70" />}
                     <span>{route.label}</span>
                     <AnimatePresence>
                        {hover === index ? (
                           <motion.span
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              layoutId="hover"
                              className="pointer-events-none absolute inset-0 -z-10 size-full rounded-[inherit] bg-gray-200"
                              transition={{ type: "spring", stiffness: 800, damping: 55 }}
                           />
                        ) : null}
                     </AnimatePresence>
                     {isSelected && (
                        <motion.span
                           layoutId="selector"
                           className="bg-primary pointer-events-none absolute -bottom-1 left-1/2 z-10 h-0.5 w-4/5 -translate-x-1/2"
                           transition={{ type: "spring", stiffness: 500, damping: 45 }}
                        />
                     )}
                     <NavigationIndicator />
                  </Link>
               );
            })}
         </div>
      </LayoutGroup>
   );
}

function NavigationIndicator() {
   const { pending } = useLinkStatus();

   if (!pending) return null;

   return (
      <span className="bg-background/70 absolute inset-0 grid place-items-center rounded-[inherit]">
         <Loader2 className="size-4 shrink-0 animate-spin" />
      </span>
   );
}
