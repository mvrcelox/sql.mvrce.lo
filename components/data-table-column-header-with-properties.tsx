"use client";

import React from "react";
import { useQueryState, parseAsArrayOf, parseAsString } from "nuqs";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, ChevronDown, EyeOff, Pin, PinOff, X } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Column } from "@tanstack/react-table";
import { Separator } from "./ui/separator";

export interface DataTableColumnHeaderProps extends React.ComponentPropsWithoutRef<"div"> {
   id: string;
   column?: Column<unknown, unknown>;
}

interface Meta {
   type: string;
   nullable: boolean;
}

export const DataTableColumnHeaderWProperties = ({
   children,
   id,
   column,
   className,
   ...props
}: DataTableColumnHeaderProps) => {
   const [hidden, setHidden] = useQueryState("hide", {
      ...parseAsArrayOf(parseAsString),
      clearOnDefault: true,
   });
   const [sort, setSort] = useQueryState("sort", { clearOnDefault: true, shallow: false });
   const [order, setOrder] = useQueryState("order", { clearOnDefault: true, shallow: false });

   const meta = (column?.columnDef.meta as Meta) ?? { type: "unknown", nullable: false };
   const type = meta.type;
   const nullable = meta.nullable;

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
            <DropdownMenuContent align="end" className="p-0">
               <div className="grid grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] gap-[inherit]">
                  <div className="flex flex-col gap-[inherit] p-1 text-sm">
                     <DropdownMenuLabel>Column properties</DropdownMenuLabel>
                     <p className="flex items-center justify-between gap-1 self-stretch">
                        <span className="text-gray-700">Type:</span>
                        <span className="text-foreground block truncate font-medium">{type}</span>
                     </p>
                     {/* <p className="flex items-center justify-between gap-1 self-stretch">
                     <span className="text-gray-700">Position:</span>
                     <span className="text-foreground block truncate font-medium">{position}</span>
                  </p> */}
                     <p className="flex items-center justify-between gap-1 self-stretch">
                        <span className="text-gray-700">Nullable:</span>
                        <span className={cn("block size-2 rounded-full", nullable ? "bg-green-500" : "bg-red-500")} />
                     </p>
                  </div>
                  <Separator orientation="vertical" />
                  <div className="flex flex-col gap-[inherit] p-1">
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
                     {column?.getCanPin() && (
                        <DropdownMenuItem onSelect={() => column.pin(column.getIsPinned() ? false : "left")}>
                           {column.getIsPinned() ? (
                              <>
                                 <PinOff className="mr-2 size-4 shrink-0" />
                                 Unpin
                              </>
                           ) : (
                              <>
                                 <Pin className="mr-2 size-4 shrink-0" />
                                 Pin
                              </>
                           )}
                        </DropdownMenuItem>
                     )}
                     <DropdownMenuItem
                        onSelect={() => {
                           if (hidden?.includes(id)) return;
                           setHidden((prev) => [...(prev ?? []), id]);
                        }}
                     >
                        <EyeOff className="mr-2 size-4 shrink-0" />
                        Hide
                     </DropdownMenuItem>
                  </div>
               </div>
            </DropdownMenuContent>
         </DropdownMenu>
      </div>
   );
};
