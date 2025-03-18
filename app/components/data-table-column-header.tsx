"use client";

import React from "react";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, ChevronDown, EyeOff, X } from "lucide-react";

import { buttonVariants } from "@/app/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export interface DataTableColumnHeaderProps extends React.ComponentPropsWithoutRef<"div"> {
   id: string;
}

export const DataTableColumnHeader = ({ children, id, className, ...props }: DataTableColumnHeaderProps) => {
   const [hidden, setHidden] = useQueryState("hide", {
      ...parseAsArrayOf(parseAsString),
      clearOnDefault: true,
   });
   const [sort, setSort] = useQueryState("sort", { clearOnDefault: true, shallow: false });
   const [order, setOrder] = useQueryState("order", { clearOnDefault: true, shallow: false });

   const router = useRouter();

   return (
      <div className={cn("flex items-center justify-between gap-2", className)} {...props}>
         {children}
         <DropdownMenu>
            <DropdownMenuTrigger
               className={buttonVariants({
                  intent: "ghost",
                  size: "none",
                  className: "aria-expanded:bg-muted group -mr-2 size-7",
               })}
            >
               {sort !== id && (
                  <ChevronDown className="size-4 shrink-0 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-aria-expanded:rotate-180" />
               )}
               {sort === id &&
                  (order === "desc" ? (
                     <ArrowDownWideNarrow className="size-4 shrink-0" />
                  ) : (
                     <ArrowUpWideNarrow className="size-4 shrink-0" />
                  ))}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
               <DropdownMenuLabel>Column actions</DropdownMenuLabel>
               {sort?.toLowerCase() === id.toLowerCase() && order?.toLowerCase() !== "desc" ? (
                  <DropdownMenuItem
                     onSelect={() => {
                        setSort(null);
                        setOrder(null);
                        router.refresh();
                     }}
                     disabled={sort !== id}
                  >
                     <X className="mr-2 size-4 shrink-0" />
                     Clear ordering
                  </DropdownMenuItem>
               ) : (
                  <DropdownMenuItem
                     onSelect={() => {
                        setSort(id);
                        setOrder(null);
                        router.refresh();
                     }}
                     disabled={!!(sort?.toLowerCase() === id.toLowerCase() && order?.toLowerCase() !== "desc")}
                  >
                     <ArrowUpWideNarrow className="mr-2 size-4 shrink-0" />
                     Ascending
                  </DropdownMenuItem>
               )}
               {sort?.toLowerCase() === id.toLowerCase() && order?.toLowerCase() === "desc" ? (
                  <DropdownMenuItem
                     onSelect={() => {
                        setSort(null);
                        setOrder(null);
                        router.refresh();
                     }}
                     disabled={sort !== id}
                  >
                     <X className="mr-2 size-4 shrink-0" />
                     Clear ordering
                  </DropdownMenuItem>
               ) : (
                  <DropdownMenuItem
                     onSelect={() => {
                        setSort(id);
                        setOrder("desc");
                        router.refresh();
                     }}
                     disabled={!!(sort?.toLowerCase() === id.toLowerCase() && order?.toLowerCase() === "desc")}
                  >
                     <ArrowDownWideNarrow className="mr-2 size-4 shrink-0" />
                     Descending
                  </DropdownMenuItem>
               )}

               <DropdownMenuSeparator />
               <DropdownMenuItem
                  onSelect={() => {
                     if (hidden?.includes(id)) return;
                     setHidden((prev) => [...(prev ?? []), id]);
                  }}
               >
                  <EyeOff className="mr-2 size-4 shrink-0" />
                  Hide
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};

{
   /* <th
   key={field.columnID}
   className="border-r border-r-zinc-200 px-3 font-normal last:border-r-0 dark:border-r-zinc-800">
   <div className="flex items-center justify-between gap-2">
      <span>{field.name}</span>
      <Button size="icon-custom" intent="ghost" className="-mr-2 size-7">
         <ChevronDown className="size-4 shrink-0" />
      </Button>
   </div>
</th> */
}
