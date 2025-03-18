import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

export const separatorVariants = cva("self-stretch bg-border", {
   variants: {
      orientation: {
         horizontal: "h-px max-h-px",
         vertical: "w-px max-w-px",
      },
   },
});

export type SeparatorProps = React.ComponentPropsWithRef<"div"> & VariantProps<typeof separatorVariants>;

export function Separator({ className, orientation = "horizontal", ...props }: SeparatorProps) {
   return (
      <div
         aria-description="separator"
         aria-orientation={orientation ?? "horizontal"}
         {...props}
         className={cn(separatorVariants({ orientation }), className)}
      />
   );
}
