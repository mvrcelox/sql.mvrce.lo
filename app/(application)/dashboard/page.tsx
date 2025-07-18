import { buttonVariants } from "@/components/ui/button";
import { H1 } from "@/components/ui/texts";
import { Construction } from "lucide-react";
import Link from "next/link";

export default async function Page() {
   return (
      <div className="flex grow flex-col items-center justify-center gap-4 self-stretch">
         {/* <div className="grid grow grid-cols-1 gap-4 self-stretch p-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4Z">
            <Card>
               <CardHeader>
                  <CardTitle>Registered databases</CardTitle>
               </CardHeader>
            </Card>
         </div> */}
         <div className="text-center">
            <Construction className="mx-auto mb-2 size-8 text-gray-600" />
            <H1>Page under construction</H1>
            <p className="text-sm text-gray-600 lg:text-base">Uh, sorry for that...</p>
         </div>
         <Link href="/databases" className={buttonVariants({ intent: "primary", size: "lg" })}>
            Go to databases
         </Link>
      </div>
   );
}
