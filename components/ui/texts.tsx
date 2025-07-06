import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const H1 = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
   ({ className, ...props }, ref) => {
      return <h1 {...props} className={cn("text-foreground text-3xl font-bold", className)} ref={ref} />;
   },
);
H1.displayName = "H1";
