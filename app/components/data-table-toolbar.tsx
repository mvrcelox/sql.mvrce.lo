"use client";

import { CheckCircle2, Eye, FileJson, FileType, Loader2, RefreshCw, Share, XCircle } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { parseAsArrayOf, parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { useTransition } from "react";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Separator } from "./ui/separator";
import Button from "./ui/button";
import { getDatabaseProperties } from "@/models/databases";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { DatatypeToTypescript, DatatypeToZodObject, SQLType } from "@/constants/converters";
import { useScripts } from "./scripts";

export interface DataTableToolbarProps {
   type?: "columns" | "rows";
}

export default function DataTableToolbar({ type = "rows" }: DataTableToolbarProps) {
   return (
      <div className="bg-background flex h-[calc(2.5rem+1px)] items-center gap-1 self-stretch border-t p-1">
         <RefreshButton />
         <Separator orientation="vertical" className="-mt-1 h-10" />
         <SaveChangesButton />
         <DiscardChangesButton />
         <Separator orientation="vertical" className="-mt-1 h-10" />
         <HiddenColumnsButton />
         <ExportButton type={type} />
         <LimitInput />
      </div>
   );
}

function RefreshButton() {
   const router = useRouter();
   return (
      <TooltipProvider disableHoverableContent delayDuration={0}>
         <Tooltip>
            <TooltipTrigger asChild>
               <Button intent="ghost" size="sm" className="gap-2 px-2" onClick={() => router.refresh()}>
                  <RefreshCw className="size-4 shrink-0" />
                  <span className="hidden md:inline">Refresh</span>
               </Button>
            </TooltipTrigger>
            <TooltipContent>Refresh the rows</TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
}

function SaveChangesButton() {
   const { scripts, show } = useScripts();

   return (
      <TooltipProvider disableHoverableContent delayDuration={0}>
         <Tooltip>
            <TooltipTrigger asChild>
               <Button
                  intent="ghost"
                  disabled={!scripts.length}
                  size="sm"
                  className="group gap-2"
                  onClick={() => show()}
               >
                  <CheckCircle2 className="size-4 shrink-0 fill-green-50 text-emerald-600 group-disabled:fill-gray-200 group-disabled:text-[inherit] dark:fill-green-950 dark:text-emerald-600" />
                  <span>Save</span>
               </Button>
            </TooltipTrigger>
            <TooltipContent>Save changes</TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
}

function DiscardChangesButton() {
   const { scripts, clearScripts } = useScripts();
   return (
      <TooltipProvider disableHoverableContent delayDuration={0}>
         <Tooltip>
            <TooltipTrigger asChild>
               <Button
                  intent="ghost"
                  disabled={!scripts.length}
                  size="sm"
                  className="group gap-2"
                  onClick={() => clearScripts()}
               >
                  <XCircle className="size-4 shrink-0 fill-red-50 text-red-600 group-disabled:fill-gray-200 group-disabled:text-[inherit] dark:fill-pink-950 dark:text-rose-600" />
                  <span>Discard</span>
               </Button>
            </TooltipTrigger>
            <TooltipContent>Discard changes</TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
}

function HiddenColumnsButton() {
   const [columns, setColumns] = useQueryState(
      "hide",
      parseAsArrayOf(parseAsString).withDefault([]).withOptions({
         clearOnDefault: true,
         scroll: false,
      }),
   );

   return (
      <DropdownMenu>
         <TooltipProvider disableHoverableContent delayDuration={0}>
            <Tooltip>
               <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                     <Button intent="ghost" size="icon" className="size-8 aria-expanded:bg-gray-200">
                        <Eye className="size-4 shrink-0" />
                     </Button>
                  </DropdownMenuTrigger>
               </TooltipTrigger>
               <TooltipContent>Hidden columns</TooltipContent>
            </Tooltip>
         </TooltipProvider>
         <DropdownMenuContent>
            <DropdownMenuLabel>Hidden columns</DropdownMenuLabel>
            {columns?.length ? (
               columns.map((column) => {
                  // const isHide = columns.find(x => x === column);
                  return (
                     <DropdownMenuItem
                        key={column}
                        onSelect={(e) => {
                           if (columns.length > 1) e.preventDefault();
                           setColumns((x) => x.filter((y) => y != column));
                        }}
                     >
                        {column}
                     </DropdownMenuItem>
                     // <div
                     //    key={column}
                     //    className="flex items-center justify-between gap-4 rounded-none border-b px-2 py-1.5 text-sm text-gray-700 transition-colors last-of-type:border-b-0"
                     // >
                     //    <span className="max-w-64 truncate">{column}</span>
                     //    <div className="flex overflow-hidden rounded-md border bg-gray-100">
                     //       <button
                     //          className="bg-gray-100 p-1 hover:bg-gray-200"
                     //          onClick={() => {
                     //             setColumns((x) => x.filter((y) => y != column));
                     //             router.refresh();
                     //          }}
                     //       >
                     //          <Eye className="size-4 shrink-0" />
                     //       </button>
                     //       <button
                     //          className="hover:bg-background bg-background border-l p-1"
                     //          // onClick={() => setColumns((x) => x.filter((y) => y != column))}
                     //       >
                     //          <EyeOff className="size-4 shrink-0" />
                     //       </button>
                     //    </div>
                     // </div>
                  );
               })
            ) : (
               <div className="px-3 py-[0.6875rem] text-center text-xs text-gray-500">No columns are hidden</div>
            )}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}

interface ExportButtonProps {
   type: "columns" | "rows";
}

function ExportButton({ type }: ExportButtonProps) {
   const params = useParams() as { databaseId: string; tableName: string };

   const { mutateAsync: waitProperties } = useMutation({
      mutationKey: ["get-properties", params],
      mutationFn: async () => {
         const [properties, err] = await getDatabaseProperties({
            databaseId: +params.databaseId,
            tableName: params.tableName,
         });

         if (err) {
            toast.error(err.message);
            return;
         }

         return properties;
      },
   });

   const { mutate: exportToTypescript, isPending: isExportingToTypescript } = useMutation({
      mutationKey: ["export-to-typescript", params],
      mutationFn: async () => {
         const properties = await waitProperties();

         const fallback = "any";
         const result = properties?.reduce<Record<string, string>>((acc, cur) => {
            const type = DatatypeToTypescript?.[cur.Type?.replace(/\((.*)\)$/g, "") as SQLType] ?? fallback;

            const suffix = type != fallback ? (cur.Nullable ? " | null" : cur.Default ? " | undefined" : "") : "";
            acc[cur.Column] = `${type}${suffix}`;
            return acc;
         }, {});

         const stringified = JSON.stringify(result, undefined, 2).replace(/("\w+?"): "(.*?)"/g, "$1: $2");
         navigator.clipboard.writeText(stringified);
         toast("Typescript copied to clipboard.");
         return result;
      },
   });

   const { mutate: exportToZodObject, isPending: isExportingToZodObject } = useMutation({
      mutationKey: ["export-to-zod-object", params],
      mutationFn: async () => {
         const properties = await waitProperties();

         const result = properties?.reduce<Record<string, string>>((acc, cur) => {
            const type = DatatypeToZodObject?.[cur.Type?.replace(/\((.*)\)$/g, "") as SQLType] ?? "z.any()";
            acc[cur.Column] =
               type +
               (cur.Nullable === "YES" && type != "z.any()"
                  ? ".nullish()"
                  : cur.Default && type != "z.any()"
                    ? ".optional()"
                    : "");
            return acc;
         }, {});

         const stringified = JSON.stringify(result, undefined, 2).replace(/("\w+?"): "(.*?)"/g, "$1: $2");
         navigator.clipboard.writeText(stringified);
         toast("Zod object copied to clipboard.");

         return result;
      },
   });

   return (
      <DropdownMenu>
         <TooltipProvider disableHoverableContent delayDuration={0}>
            <Tooltip>
               <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                     <Button
                        disabled={isExportingToTypescript}
                        intent="ghost"
                        size="icon"
                        className="size-8 aria-expanded:bg-gray-200"
                     >
                        {isExportingToTypescript || isExportingToZodObject ? (
                           <Loader2 className="size-4 shrink-0 animate-spin" />
                        ) : (
                           <Share className="size-4 shrink-0" />
                        )}
                     </Button>
                  </DropdownMenuTrigger>
               </TooltipTrigger>
               <TooltipContent>Export table</TooltipContent>
            </Tooltip>
         </TooltipProvider>
         <DropdownMenuContent className="relative">
            {/* <Button intent="ghost" size="icon" className="absolute top-1 right-1 size-6">
               <X className="size-3 shrink-0" />
            </Button> */}
            {type === "columns" ? (
               <>
                  <DropdownMenuLabel>Export columns</DropdownMenuLabel>
                  <DropdownMenuItem
                     disabled={isExportingToTypescript}
                     className="justify-between gap-2"
                     onSelect={() => exportToTypescript()}
                  >
                     Typescript
                     <FileType className="size-4 shrink-0" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     disabled={isExportingToZodObject}
                     className="justify-between gap-2"
                     onSelect={() => exportToZodObject()}
                  >
                     Zod object
                     <FileJson className="size-4 shrink-0" />
                  </DropdownMenuItem>
               </>
            ) : (
               <>
                  <DropdownMenuLabel>Export columns</DropdownMenuLabel>
                  <DropdownMenuItem
                     disabled={isExportingToTypescript}
                     className="justify-between gap-2"
                     onSelect={() => exportToTypescript()}
                  >
                     Typescript
                     <FileType className="size-4 shrink-0" />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                     disabled={isExportingToZodObject}
                     className="justify-between gap-2"
                     onSelect={() => exportToZodObject()}
                  >
                     Zod object
                     <FileJson className="size-4 shrink-0" />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="pr-8">Export rows</DropdownMenuLabel>
                  <DropdownMenuItem className="justify-between gap-2">
                     JSON
                     <FileJson className="size-4 shrink-0" />
                  </DropdownMenuItem>
                  <div className="flex items-center justify-between gap-8 px-2 py-1 pr-0 text-sm">
                     Excel
                     <div className="flex items-center rounded-sm border">
                        <DropdownMenuItem className="justify-between gap-2 rounded-r-none px-1.5 py-1 text-xs">
                           XLSX
                        </DropdownMenuItem>
                        {/* <FileSpreadsheet className="size-4 shrink-0" /> */}
                        <DropdownMenuItem className="justify-between gap-2 rounded-l-none border-l px-1.5 py-1 text-xs">
                           CSV
                           {/* <FileSpreadsheet className="size-4 shrink-0" /> */}
                        </DropdownMenuItem>
                     </div>
                  </div>
               </>
            )}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}

function LimitInput() {
   const [isPending, startTransition] = useTransition();

   const [limit, setLimit] = useQueryState(
      "limit",
      parseAsInteger.withDefault(200).withOptions({
         clearOnDefault: true,
         scroll: false,
         shallow: false,
         startTransition,
      }),
   );

   return (
      <TooltipProvider disableHoverableContent delayDuration={0}>
         <Tooltip>
            <TooltipTrigger asChild>
               <div className="relative max-w-20">
                  <Input
                     disabled={isPending}
                     intent="opaque"
                     size="sm"
                     aria-label="numeric"
                     inputMode="numeric"
                     pattern="[0-9]*"
                     className="shrink-0"
                     defaultValue={limit}
                     onKeyDown={(e) => {
                        if (e.key === "Escape") {
                           e.currentTarget.value = `${limit}`;
                           e.currentTarget.blur();
                        }
                        if (e.key === "Enter") {
                           e.currentTarget.blur();
                        }
                     }}
                     onBlur={(e) => {
                        let value = Number(e.currentTarget.value);

                        {
                           const isValid = !!isFinite(value);
                           if (!isValid) return (e.currentTarget.value = `${limit}`);
                        }

                        value = parseInt(e.currentTarget.value);

                        {
                           const isDifferent = value != limit;
                           if (!isDifferent) return (e.currentTarget.value = `${value}`);
                        }

                        setLimit(value);
                        e.currentTarget.value = `${value}`;
                     }}
                  />
                  {isPending && (
                     <Loader2 className="pointer-events-none absolute top-2 right-2 size-4 shrink-0 animate-spin text-gray-700" />
                  )}
               </div>
            </TooltipTrigger>
            <TooltipContent>Limit rows</TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
}
