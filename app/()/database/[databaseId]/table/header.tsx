"use client";

import Button from "@/app/components/ui/button";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function TableHeader() {
   const params = useParams();
   const pathname = usePathname();

   const endWithProperties = pathname.endsWith("properties");

   return (
      <div className="flex h-[calc(2.5rem+1px)] items-center border-b bg-gray-200 p-1">
         <Button
            asChild
            aria-selected={endWithProperties}
            intent={endWithProperties ? "outline" : "ghost"}
            size="sm"
            className={"border [&:not([aria-selected='true'])]:border-transparent"}
         >
            <Link href={`/database/${params.databaseId}/table/${params.tableName}/properties`}>Properties</Link>
         </Button>
         <Button
            asChild
            aria-selected={!endWithProperties}
            intent={endWithProperties ? "ghost" : "outline"}
            size="sm"
            className={"border [&:not([aria-selected='true'])]:border-transparent"}
         >
            <Link href={`/database/${params.databaseId}/table/${params.tableName}`}>Data</Link>
         </Button>
      </div>
   );
}
