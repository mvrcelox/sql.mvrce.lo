import { buttonVariants } from "@/app/components/ui/button";
import Link from "next/link";
import { Footer } from "./components/footer";
import { Header } from "./components/header";

export default function NotFound() {
   return (
      <>
         <Header />
         <div className="flex grow flex-col items-center justify-center gap-2">
            <section className="flex flex-col">
               <h1 className="text-foreground mb-2 text-center text-2xl font-semibold md:mb-4 md:text-3xl">
                  We are sorry!
               </h1>
               <p className="text-center text-sm text-gray-700 md:text-base">
                  The page you are looking for is currently under construction.
               </p>
               <p className="text-center text-sm text-gray-700 md:text-base">Please check back later.</p>
            </section>
            <div className="mt-2 flex items-center gap-2 md:mt-4">
               <Link
                  href="/"
                  className={buttonVariants({
                     intent: "primary",
                     size: "lg",
                  })}
               >
                  Back to home
               </Link>
            </div>
         </div>
         <Footer />
      </>
   );
}
