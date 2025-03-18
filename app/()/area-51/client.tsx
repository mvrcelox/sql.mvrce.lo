"use client";

import { Input } from "@/app/components/ui/input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { parseAsString, useQueryState } from "nuqs";
import { useTransition } from "react";

export default function Client() {
   const [isPending, startTransition] = useTransition();
   const [input, setInput] = useQueryState(
      "input",
      parseAsString.withDefault("").withOptions({
         clearOnDefault: true,
         scroll: false,
         startTransition,
         shallow: false,
      }),
   );

   const router = useRouter();

   return (
      <>
         <Input value={input} onBlur={() => router.refresh()} onChange={(e) => setInput(e.currentTarget.value)} />
         {isPending ? <Loader2 className="size-4 shrink-0 animate-spin" /> : null}
      </>
   );
}
