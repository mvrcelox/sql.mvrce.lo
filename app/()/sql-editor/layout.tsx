import Button from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <div aria-description="layout" className="flex grow self-stretch">
         <div className="flex max-w-[calc(2.5rem+1px)] flex-col border-r p-1">
            <Button intent="ghost" size="icon" className="size-8">
               <ChevronRight className="size-4 shrink-0" />
            </Button>
            {/* <Button intent="ghost" size="icon" className="size-8">
               <ChevronRight className="size-4 shrink-0" />
            </Button> */}
         </div>
         {children}
      </div>
   );
}
