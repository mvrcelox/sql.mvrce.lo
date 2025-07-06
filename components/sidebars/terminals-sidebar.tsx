import { ChevronRight } from "lucide-react";
import Button from "../ui/button";

export default function TerminalsSidebar() {
   return (
      <aside className="flex flex-col gap-1 self-stretch p-1">
         <Button intent="ghost" size="icon" className="size-8">
            <ChevronRight className="size-4" />
         </Button>
      </aside>
   );
}
