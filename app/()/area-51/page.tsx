import Client from "./client";
import { loadSearchParams } from "./nuqs";
import type { SearchParams } from "nuqs/server";

interface PageProps {
   searchParams: Promise<SearchParams>;
}

export default async function Page({ searchParams }: PageProps) {
   const awaited = await loadSearchParams(searchParams);
   return (
      <div className="grid grow place-items-center self-stretch">
         <div className="flex flex-col gap-2">
            Hello {awaited.input}
            <Client />
         </div>
      </div>
   );
}
