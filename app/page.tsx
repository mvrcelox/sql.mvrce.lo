import { Footer } from "@/app/components/footer";
import { ReadMoreButton } from "@/app/components/read-more-button";
import { buttonVariants } from "@/app/components/ui/button";
import Link from "next/link";
import { SlideInContent, SlideInRoot } from "./components/ui/motion/slide-in";
import BadgeLogo from "./components/badge-logo";
import { auth } from "@/auth";

export default async function Page() {
   const session = await auth();
   return (
      <>
         {/* <Header /> */}
         <div className="relative flex grow flex-col items-center justify-center gap-2">
            <SlideInRoot>
               <SlideInContent>
                  <BadgeLogo />
               </SlideInContent>
            </SlideInRoot>
            <section className="relative flex flex-col">
               <h1 className="text-foreground mb-2 text-center text-2xl font-semibold md:mb-4 md:text-3xl">
                  <SlideInRoot>
                     <SlideInContent delay={0.1} className="last-child:mr-0 mr-[.175em]">
                        Access your databases from anywhere with security
                     </SlideInContent>
                  </SlideInRoot>
                  {/* <SlideIn>Access</SlideIn> <SlideIn delay={0.1}>your</SlideIn>{" "}
                     <SlideIn delay={0.2}>databases</SlideIn>{" "}
                     <SlideIn delay={0.3}>from</SlideIn>{" "}
                     <SlideIn delay={0.4}>anywhere</SlideIn>{" "}
                     <SlideIn delay={0.5}>with</SlideIn>{" "}
                     <SlideIn delay={0.6}>security.</SlideIn>{" "}
                     databases anywhere with security. */}
               </h1>
               <SlideInRoot>
                  <SlideInContent tag="p" delay={0.2} className="text-center text-sm text-gray-700 md:text-base">
                     Manage and control your <span className="font-semibold">DATABASES</span> with our modern web
                     interface.
                  </SlideInContent>
               </SlideInRoot>
               <SlideInRoot>
                  <SlideInContent tag="p" delay={0.3} className="text-center text-sm text-gray-700 md:text-base">
                     You in control, anywhere.
                  </SlideInContent>
               </SlideInRoot>
            </section>
            <SlideInRoot>
               <SlideInContent delay={0.4} duration={0.5} className="relative mt-2 flex items-center gap-2 md:mt-4">
                  <Link
                     href={session?.user ? "/dashboard" : "/auth/sign-in"}
                     className={buttonVariants({
                        intent: "primary",
                        size: "lg",
                     })}
                  >
                     Get started!
                  </Link>
                  <ReadMoreButton size="lg" />
               </SlideInContent>
            </SlideInRoot>
         </div>
         <Footer />
      </>
   );
}
