import { Logo } from "@/app/components/ui/logo";

export default function BadgeLogo() {
   return (
      <div className="hover:border-border bg-background mx-auto flex cursor-pointer items-center gap-1 rounded-full border-1 border-gray-200 px-2 py-1 text-base transition-colors select-none hover:bg-gray-200 hover:shadow-inner">
         <Logo className="size-5" />
         <span className="text-foreground px-1 font-medium">mvrcelo</span>
      </div>
   );
}
