import Link from "next/link";
import Layout from "./(marketing)/layout";
import { H1 } from "@/components/ui/texts";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
   return (
      <Layout>
         <div className="m-auto flex max-w-3xl -translate-y-12 flex-col items-center gap-2 sm:gap-4">
            <div className="text-center">
               <H1>Page not found!</H1>
               <p className="text-sm text-gray-600 lg:text-base">The page you are trying to look is not available</p>
            </div>
            <Link
               href="/"
               className={buttonVariants({
                  intent: "primary",
                  size: "lg",
                  className: "group gap-2",
               })}
            >
               Back to home
               <ArrowRight className="size-4 shrink-0 duration-100" />
            </Link>
         </div>
      </Layout>
   );
}
