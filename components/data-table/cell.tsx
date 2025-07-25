"use client";

import { cn } from "@/lib/utils";
import { CircleCheck, CircleDashed, CircleSlash, Copy, Redo, RotateCcw, Search, Undo } from "lucide-react";

import { useCallback, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

import {
   ContextMenu,
   ContextMenuContent,
   ContextMenuItem,
   ContextMenuLabel,
   ContextMenuSeparator,
   ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useScripts } from "../scripts";
import { useParams } from "next/navigation";
import { TooltipRoot, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { AvailableSQLTypes } from "@/constants/converters";

type Type = AvailableSQLTypes;

interface FormatReturn {
   data: string | null;
   className?: string;
}

function format<T>(cell: T): FormatReturn {
   switch (typeof cell) {
      case "bigint":
         return { data: Number(cell).toString(), className: "text-end" };
      case "boolean":
         // const Icon = cell ? Check : X;
         return {
            data: cell ? "true" : "false",
         };

      case "number":
         return { data: cell?.toString() };
      case "string":
         return { data: cell };
      case "object": {
         if (cell === null) return { className: "text-center text-gray-400", data: null };
         if (Array.isArray(cell)) return { data: JSON.stringify(cell) };
         if (cell instanceof Date) return { data: cell?.toISOString() };
         return { data: JSON.stringify(cell) };
      }
      case "undefined":
         return { className: "text-center text-gray-400", data: null };
      default:
         return {
            className: "text-center text-gray-400",
            data: null,
         };
      // case "null": return { type: 'null', className: "", format: () => <span>null</span> };
      // case "undefined": return { type: 'unknown', className: "", format: () => <span>undefined</span> };
   }
}

interface CellProps {
   pkName: string;
   pkValue: string | number;
   name: string;
   position: number;
   type: Type;
   nullable: boolean;
   fallback?: unknown;
   readOnly?: boolean;
   defaultValue: unknown;
}

export default function Cell({ pkName, pkValue, name, type, nullable, defaultValue, readOnly }: CellProps) {
   const isDirty = useRef<boolean>(false);
   const inputRef = useRef<HTMLInputElement | null>(null);
   const params = useParams<{ id: string; table: string }>();

   const databaseId = params.id;
   const tableName = params.table;

   const scriptId = useRef<string | undefined>(undefined);
   const { setDatabase, setScript, removeScript } = useScripts();

   const formatted = format(defaultValue);

   const [, setFocus] = useState<boolean>(false);
   const [index, setIndex] = useState<number>(0);
   const [history, setHistory] = useState<(string | null)[]>([formatted.data]);

   const value = history[index];
   function setValue(value: string | null) {
      setHistory((x) => [...x.slice(0, index + 1), value]);
      setIndex((x) => x + 1);
   }

   const canUndo = index > 0;
   const canRedo = index < history.length - 1;

   function clearScript() {
      if (!scriptId.current) return;
      removeScript(scriptId.current);
      scriptId.current = undefined;
   }

   function undo() {
      if (index === 0) return;

      const i = index - 1;
      setIndex(i);
      const undo = history[i];

      if (undo === history[0]) return clearScript();

      // Format the data to SQL format
      const sql = getSQL(undo!);
      if (!sql) return;

      // Append/update the script
      scriptId.current = setScript(sql, {
         id: scriptId.current,
         callback: (method) => {
            scriptId.current = undefined;
            switch (method) {
               case "run": {
                  reset(undo);
                  break;
               }
               case "clear": {
                  reset();
                  break;
               }
            }
         },
      });
   }

   function redo() {
      if (history.length <= index + 1) return;

      const i = index + 1;
      setIndex(i);
      const redo = history[i];

      if (redo === history[0]) return clearScript();

      // Format the data to SQL format
      const sql = getSQL(redo);
      if (!sql) return;

      // Append/update the script
      function callback(method: "clear" | "run") {
         scriptId.current = undefined;
         switch (method) {
            case "run": {
               reset(redo);
               break;
            }
            case "clear": {
               reset();
               break;
            }
         }
      }

      scriptId.current = setScript(sql, {
         id: scriptId.current,
         callback,
      });
   }

   const reset = (value?: (typeof history)[number]) => {
      clearScript();
      setIndex(0);
      setHistory((x) => [value ?? x[0]]);
   };

   const getSQL = useCallback(
      function (current: string | null) {
         let sql = "";

         switch (type) {
            case "date":
               const date = new Date(current ?? "");
               if (isNaN(date.getTime())) return;
               sql = `'${date.toISOString()}'`;
               break;
            case "timestamp":
            case "timestamptz":
               const timestamp = new Date(current ?? "");
               if (isNaN(timestamp.getTime())) return;
               sql = `'${timestamp.toISOString()}'`;
               break;
            case "_int2":
            case "_int4":
               try {
                  const arr = JSON.parse(current ?? "[]");
                  if (!Array.isArray(arr)) return;
                  if (arr.some((x) => typeof x !== "number")) return;
                  sql = `'${JSON.stringify(arr)}'`;
               } catch {
                  return;
               }
               break;
            case "_text":
               try {
                  const arr = JSON.parse(current ?? "[]");
                  if (!Array.isArray(arr)) return;
                  if (arr.some((x) => typeof x !== "string")) return;
                  sql = `'${JSON.stringify(arr)}'`;
               } catch {
                  return;
               }
            case "int2":
            case "int4":
            case "int8":
               const num = Number(current);
               if (isNaN(num)) return;
               sql = num.toFixed(0);
               break;
            case "numeric":
            case "float4":
            case "float8":
               const float = Number(current);
               if (isNaN(float)) return;
               sql = float.toFixed(0);
               break;

            case "bool": {
               if (!["true", "false"].includes(current ?? "")) return;
               sql = `${current}`;
               break;
            }
            case "json": {
               try {
                  const parsed = JSON.parse(current ?? "");
                  sql = `'${JSON.stringify(parsed)}'`;
               } catch {
                  return;
               }
               break;
            }
            case "uuid":
            case "text":
            case "varchar": {
               sql = `'${current ?? ""}'`;
               break;
            }
            default:
               break;
         }
         return `UPDATE ${tableName} SET ${name} = ${sql} WHERE ${pkName} = '${pkValue}';`;
      },
      [type, name, pkName, pkValue, tableName],
   );

   function detectChange(current: string | null) {
      if (!isDirty.current) return;
      isDirty.current = false;

      if (current === history[index]) return;

      if (current === history[0]) {
         setValue(current);
         clearScript();
         return;
      }

      const script = getSQL(current);
      if (!script) {
         toast.error("Invalid value");
         if (inputRef.current) inputRef.current.value = value ?? "";
         return;
      }

      setValue(current);
      setDatabase(databaseId);

      function callback(method: "clear" | "run") {
         scriptId.current = undefined;
         switch (method) {
            case "run": {
               setValue(current);
               break;
            }
            case "clear": {
               reset();
               break;
            }
         }
      }
      scriptId.current = setScript(script, { id: scriptId.current, callback });
   }

   // useEffectAfterMount(() => {
   //    if (!inputRef.current) return;
   //    inputRef.current.value = value ?? "";
   // }, [value]);

   return (
      <>
         <ContextMenu>
            <span
               className={cn(
                  "block w-full px-2 leading-7 whitespace-nowrap",
                  type === "numeric" && "text-end",
                  !readOnly && "invisible",
               )}
            >
               {value}
            </span>
            {readOnly ? null : (
               <ContextMenuTrigger asChild>
                  <Input
                     ref={inputRef}
                     intent="none"
                     size="none"
                     data-changed={value != history[0]}
                     onFocusCapture={() => setFocus(true)}
                     onBlurCapture={() => setFocus(false)}
                     onChange={() => (isDirty.current = true)}
                     onBlur={(e) => {
                        detectChange(e.currentTarget.value);
                        isDirty.current = false;
                     }}
                     onKeyDown={(e) => {
                        if (
                           e.ctrlKey &&
                           e.key === "c" &&
                           e.currentTarget.selectionStart === e.currentTarget.selectionEnd
                        ) {
                           e.preventDefault();
                           navigator.clipboard.writeText(value ?? "");
                           toast.success("Copied to clipboard");
                        }
                        if (e.ctrlKey && e.key === "z") {
                           e.preventDefault();
                           undo();
                        }
                        if (e.ctrlKey && e.key === "y") {
                           e.preventDefault();
                           redo();
                        }
                        if (e.key === "Escape") {
                           isDirty.current = false;
                           e.currentTarget.value = value ?? "";
                           e.currentTarget.blur();
                        }
                        if (e.key === "Enter" && !e.ctrlKey) {
                           e.currentTarget.blur();
                        }
                     }}
                     className={cn(
                        "data-[changed='true']:!bg-primary/10 caret-foreground selection:bg-primary/20 absolute inset-0 h-full w-full rounded-none px-2 overflow-ellipsis group-[data-pinned]:z-[1]",
                        // focus && "bg-background",
                        type === "numeric" && "text-end",
                        value === null &&
                           "placeholder-shown:not-focus:text-center placeholder-shown:focus:placeholder:text-transparent",
                     )}
                     placeholder={value === null ? "[NULL]" : undefined}
                     defaultValue={value ?? ""}
                  />
               </ContextMenuTrigger>
            )}
            <ContextMenuContent className="min-w-40" onCloseAutoFocus={(e) => e.preventDefault()}>
               <div className="flex items-center">
                  <ContextMenuItemWithTooltip
                     disabled={!canUndo}
                     onSelect={() => undo()}
                     tooltip="Undo"
                     className="p-2"
                  >
                     <Undo className="size-4 shrink-0" />
                  </ContextMenuItemWithTooltip>
                  <ContextMenuItemWithTooltip
                     disabled={!canRedo}
                     onSelect={() => redo()}
                     tooltip="Redo"
                     className="p-2"
                  >
                     <Redo className="size-4 shrink-0" />
                  </ContextMenuItemWithTooltip>
                  <ContextMenuItemWithTooltip
                     disabled={!canRedo && !canUndo}
                     onSelect={() => reset()}
                     tooltip="Reset"
                     className="p-2"
                  >
                     <RotateCcw className="size-4 shrink-0" />
                  </ContextMenuItemWithTooltip>
                  <ContextMenuItemWithTooltip
                     tooltip="Copy"
                     className="p-2"
                     onClick={() => {
                        try {
                           navigator.clipboard.writeText(value ?? "");
                        } catch {
                           toast.error("Failed to copy to clipboard");
                        }
                     }}
                  >
                     <Copy className="size-4 shrink-0" />
                  </ContextMenuItemWithTooltip>
                  <ContextMenuItemWithTooltip disabled tooltip="Find" className="p-2">
                     <Search className="size-4 shrink-0" />
                  </ContextMenuItemWithTooltip>
               </div>
               <ContextMenuSeparator />
               <ContextMenuLabel>Properties</ContextMenuLabel>
               <div className="flex flex-col gap-1 px-1 pb-1 text-sm">
                  {/* <p className="flex items-center justify-between gap-1 self-stretch">
                     <span className="text-gray-700">Name:</span>
                     <span className="text-foreground block truncate font-medium">{name}</span>
                  </p> */}
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

               <ContextMenuSeparator />
               {/* <ContextMenuLabel>Actions</ContextMenuLabel> */}
               <ContextMenuItem
                  disabled={value === "[NULL]" || !nullable}
                  onSelect={() => {
                     isDirty.current = true;
                     detectChange(null);
                     isDirty.current = false;
                  }}
                  className="gap-2"
               >
                  <CircleDashed className="size-4 shrink-0" />
                  Set null
               </ContextMenuItem>
               {type === "bool" ? (
                  <ContextMenuItem
                     disabled={value === null}
                     onSelect={() => {
                        isDirty.current = true;
                        detectChange(value === "true" ? "false" : "true");
                        isDirty.current = false;
                     }}
                     className="gap-2"
                  >
                     {value === "true" ? (
                        <CircleSlash className="size-4 shrink-0" />
                     ) : (
                        <CircleCheck className="size-4 shrink-0" />
                     )}
                     Set {value === "true" ? "false" : "true"}
                  </ContextMenuItem>
               ) : null}
            </ContextMenuContent>
         </ContextMenu>
      </>
   );
}

function ContextMenuItemWithTooltip({
   children,
   tooltip,
   ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuItem> & { tooltip?: string | React.ReactNode }) {
   return (
      <TooltipProvider>
         <TooltipRoot>
            <TooltipTrigger asChild>
               <ContextMenuItem {...props}>{children}</ContextMenuItem>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
         </TooltipRoot>
      </TooltipProvider>
   );
}
