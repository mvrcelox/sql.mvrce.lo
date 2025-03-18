import { Footer } from "@/app/components/footer";
import { buttonVariants } from "@/app/components/ui/button";
import { MoveLeft } from "lucide-react";
import Link from "next/link";

export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <div className="relative flex grow flex-col self-stretch bg-[url(/noise-light.png)] dark:bg-[url(/noise-dark.png)]">
         <Link
            href="/"
            className={buttonVariants({ intent: "ghost", className: "absolute top-2 left-2 gap-2 md:top-6 md:left-6" })}
         >
            <MoveLeft className="size-4 shrink-0" />
            Back to home
         </Link>
         <div className="flex grow flex-col items-center justify-center self-stretch p-2">{children}</div>
         <Footer />
      </div>
   );
}
