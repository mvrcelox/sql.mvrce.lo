"use client";

import {
   CheckCircle2,
   Eye,
   EyeOff,
   FileJson,
   FileType,
   Loader2,
   RefreshCw,
   Search,
   Share,
   X,
   XCircle,
} from "lucide-react";
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
import { useCallback, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { Separator } from "./ui/separator";
import Button from "./ui/button";
import { getDatabaseProperties } from "@/models/databases";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { DatatypeToTypescript, DatatypeToZodObject, SQLType } from "@/constants/converters";
import { useScripts } from "./scripts";
import debounce from "debounce";
import { cn } from "@/lib/utils";

export interface DataTableToolbarProps {
   type?: "columns" | "rows";
}

export default function DataTableToolbar({ type = "rows" }: DataTableToolbarProps) {
   return (
      <div className="z-10 -mt-px flex h-[calc(2.5rem+1px)] items-center gap-1 self-stretch border-t bg-gray-100 p-1">
         <RefreshButton />

         <Separator orientation="vertical" className="h-4 self-center" />

         <SaveChangesButton />
         <DiscardChangesButton />

         <Separator orientation="vertical" className="h-4 self-center" />

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
   const params = useParams() as { databaseId: string; tableName: string };

   const [open, setOpen] = useState<boolean>(false);
   const [mode, setMode] = useState<"idle" | "search">("idle");
   const [search, setSearch] = useState<string>("");
   const [columns, setColumns] = useQueryState(
      "hide",
      parseAsArrayOf(parseAsString).withDefault([]).withOptions({
         clearOnDefault: true,
         scroll: false,
      }),
   );

   const { data, isLoading } = useQuery({
      queryKey: ["get-properties", params],
      queryFn: async () => {
         const [properties, err] = await getDatabaseProperties({
            databaseId: +params.databaseId,
            tableName: params.tableName,
         });

         if (err) {
            toast.error(err.message);
            return [];
         }

         return properties;
      },
      refetchOnMount: true,
      refetchInterval: false,
      refetchOnReconnect: false,
   });

   const handleInputChange = useCallback(
      debounce((e: React.ChangeEvent<HTMLInputElement>) => {
         setSearch(e.target?.value ?? "");
      }, 200),
      [],
   );

   return (
      <DropdownMenu
         open={open}
         onOpenChange={(open) => {
            setMode("idle");
            setOpen(open);
         }}
      >
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
         <DropdownMenuContent className="max-h-[70svh] min-w-52">
            <div className="flex items-center gap-1">
               {mode === "idle" ? (
                  <DropdownMenuLabel>Hidden columns</DropdownMenuLabel>
               ) : (
                  <Input
                     autoFocus
                     size="sm"
                     className="w-0 grow"
                     defaultValue={search}
                     onKeyDown={(e) => {
                        e.stopPropagation();
                     }}
                     onChange={handleInputChange}
                  />
               )}
               <div className="ml-auto">
                  {mode === "idle" && (
                     <Button
                        disabled={isLoading}
                        intent="ghost"
                        size="icon"
                        className="size-8"
                        onClick={() => setColumns(columns?.length > 0 ? [] : (data?.map((x) => x?.Column) ?? []))}
                     >
                        {columns?.length > 0 ? (
                           <Eye className="size-4 shrink-0" />
                        ) : (
                           <EyeOff className="size-4 shrink-0" />
                        )}
                     </Button>
                  )}
                  <Button
                     intent="ghost"
                     size="icon"
                     className="size-8"
                     onClick={() => {
                        setMode(mode === "idle" ? "search" : "idle");
                     }}
                  >
                     {mode === "idle" ? <Search className="size-4 shrink-0" /> : <X className="size-4 shrink-0" />}
                  </Button>
               </div>
            </div>
            <DropdownMenuSeparator />
            <div className={cn("max-h-[calc(2rem*6)] overflow-y-auto", data && data?.length > 6 && "pr-1")} aria-hidden>
               <div className="hidden flex-col gap-2 px-3 py-4 text-center text-xs text-gray-500 first:last:flex">
                  No columns found.
               </div>
               {!isLoading
                  ? data
                       ?.filter((x) =>
                          mode === "idle" ? true : x.Column?.toLowerCase().includes(search.toLowerCase()),
                       )
                       ?.map((item) => {
                          const isHide = columns.find((x) => x === item.Column);
                          const Icon = isHide ? EyeOff : Eye;
                          return (
                             //   <motion.div key={item.Column} className="block">
                             <DropdownMenuItem
                                key={item.Column}
                                onSelect={(e) => {
                                   e.preventDefault();
                                   setColumns((x) =>
                                      isHide ? x.filter((y) => y != item.Column) : [...x, item.Column],
                                   );
                                }}
                             >
                                <Icon className="size-4 shrink-0" />
                                {item.Column}
                             </DropdownMenuItem>
                             //   </motion.div>
                          );
                       })
                  : null}
            </div>
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
      onError: () => toast.error("An error happened getting the table properties."),
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
         return result;
      },
      onError: () => toast.error("An error happened trying to copy the properties to typescript."),
      onSuccess: () => toast("Typescript copied to clipboard."),
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
         return result;
      },
      onError: () => {
         toast.error("An error happened trying to copy the properties to zod.");
      },
      onSuccess: () => toast("Zod object copied to clipboard."),
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
