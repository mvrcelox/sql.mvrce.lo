import { cn } from "@/lib/utils";

import { ThemeToggle } from "./client";

export function Toolbar({
   className,
   ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
   return (
      <div {...props} className={cn("bg-background flex self-stretch border-t p-1", className)}>
         <span className="grow" />
         <ThemeToggle size="sm" className="shrink-0 border-0" />
      </div>
   );
}
