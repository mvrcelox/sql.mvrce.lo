import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";

export default function BadgeLogo({ className }: { className?: string }) {
   return (
      <div
         className={cn(
            "bg-background mx-auto inline-flex cursor-pointer items-center gap-1 rounded-full border-1 border-gray-200 px-2 py-1 text-base transition-colors select-none hover:bg-gray-200",
            className,
         )}
      >
         <Logo className="size-5" />
         <span className="text-foreground px-1 font-medium">.lo</span>
      </div>
   );
}
