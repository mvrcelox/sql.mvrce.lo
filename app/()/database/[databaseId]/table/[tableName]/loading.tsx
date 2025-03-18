import { Loader2 } from "lucide-react";

export default function Loading() {
   return (
      <main className="grid grow place-items-center self-stretch bg-gray-100">
         <Loader2
            className="animate-spin-reverse col-start-1 col-end-1 row-start-1 row-end-1 size-10 shrink-0"
            strokeWidth={1}
         />
         <Loader2 className="col-start-1 col-end-1 row-start-1 row-end-1 size-5 shrink-0 animate-spin" />
      </main>
   );
}
