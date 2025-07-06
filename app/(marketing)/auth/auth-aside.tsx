"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const GROUPED_ROUTES = [
   [
      { id: "sign-in", label: "Sign in", href: "/auth/sign-in" },
      { id: "sign-up", label: "Sign up", href: "/auth/sign-up" },
   ],
   [{ id: "forgot-password", label: "Forgot password", href: "/auth/forgot-password" }],
];

export default function AuthAside() {
   const pathname = usePathname();
   return (
      <aside className="flex flex-row max-lg:w-full max-lg:max-w-[29.5rem] max-lg:justify-between lg:flex-col">
         <Link
            href="/"
            className={cn(buttonVariants({ intent: "item", size: "sm" }), "mb-4 justify-start gap-2 text-left")}
         >
            <ArrowLeft className="size-4" />
            <span>Home</span>
         </Link>
         <div className="xs:flex hidden flex-row lg:flex-col lg:gap-4">
            {GROUPED_ROUTES.map((routes, index) => (
               <div key={index} className="flex flex-row lg:flex-col">
                  {routes.map((route) => (
                     <Link
                        key={route.id}
                        aria-pressed={pathname === route.href}
                        href={route.href}
                        className={cn(buttonVariants({ intent: "item", size: "sm" }), "justify-start text-left")}
                     >
                        {route.label}
                     </Link>
                  ))}
               </div>
            ))}
         </div>
      </aside>
   );
}
