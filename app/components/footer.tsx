import { ThemeToggle } from "@/app/components/theme-selector";
import { Logo } from "@/app/components/ui/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function Footer({
   className,
   ...props
}: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>) {
   return (
      <footer
         {...props}
         className={cn(
            "bg-background flex h-8 self-stretch border-t text-sm md:h-[calc(2.5rem+1px)] [&>*:not(:last-child)]:border-r",
            className,
         )}
      >
         <div className="flex shrink-0 items-center justify-center px-3 font-medium text-gray-500 select-none">
            <span>Prototype</span>
            <span className="mx-2 size-1 rounded-full bg-gray-500" />
            <span>0001</span>
         </div>
         <div className="shrink-0 grow"></div>
         <ThemeToggle className="shrink-0 border-0 [&>button]:size-[2rem] md:[&>button]:size-[2.5rem]" />
         <Link
            href="https://github.com/mvrcelitos"
            target="_blank"
            className="flex aspect-square h-full shrink-0 items-center justify-center gap-2 text-base text-gray-700 hover:bg-gray-200"
         >
            <Logo className="size-5" />
         </Link>
      </footer>
   );
}
