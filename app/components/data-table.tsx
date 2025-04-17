"use client";

import { DataTableColumnHeader } from "@/app/components/data-table-column-header";
import { Table, TBody, Td, Th, THead, TRow } from "@/app/components/ui/table";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleDashed, CircleSlash, Copy, Redo, RotateCcw, Search, Undo } from "lucide-react";

import {
   Column,
   ColumnDef,
   ColumnPinningState,
   ColumnResizeDirection,
   ColumnResizeMode,
   flexRender,
   getCoreRowModel,
   getFacetedRowModel,
   useReactTable,
   VisibilityState,
} from "@tanstack/react-table";
import { CSSProperties, useRef, useState } from "react";
import { Input } from "./ui/input";

import {
   ContextMenu,
   ContextMenuContent,
   ContextMenuItem,
   ContextMenuLabel,
   ContextMenuSeparator,
   ContextMenuTrigger,
} from "@/app/components/ui/context-menu";
import { parseAsArrayOf, parseAsString, useQueryState } from "nuqs";
import { useScripts } from "./scripts";
import { useParams } from "next/navigation";
import useEffectAfterMount from "@/hooks/use-effect-after-mount";
import { GetTableReturn } from "@/lib/database-factory";
import { DatatypeToJavascript } from "@/constants/converters";
import { Tooltip, TooltipContent, TooltipProvider } from "./ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import { toast } from "sonner";

export interface GenericFieldProps {
   columnID: number;
   dataTypeID: number;
   dataTypeSize: number;
   format: string;
   name: string;
   tableID: number;
}

export interface DataTableProps {
   count: GetTableReturn["count"];
   fields?: GetTableReturn["fields"];
   rows?: GetTableReturn["rows"];
   defaultHeader?: boolean;
   editable?: boolean;
}

interface TableCellFormatterReturn {
   type: "date" | "boolean" | "number" | "string" | "array" | "json" | "null" | "unknown";
   data: string | null;
   className?: string;
}

function tableCellFormatter<T>(cell: T): TableCellFormatterReturn {
   switch (typeof cell) {
      case "bigint":
         return { type: "number", data: Number(cell).toString(), className: "text-end" };
      case "boolean":
         // const Icon = cell ? Check : X;
         return {
            type: "boolean",
            data: cell ? "true" : "false",
         };

      case "number":
         return { type: "number", data: cell?.toString() };
      case "string":
         return { type: "string", data: cell };
      case "object": {
         if (cell === null) return { type: "null", className: "text-center text-gray-400", data: null };
         if (Array.isArray(cell)) return { type: "array", data: JSON.stringify(cell) };
         if (cell instanceof Date) return { type: "date", data: cell?.toISOString() };
         return { type: "json", data: JSON.stringify(cell) };
      }
      case "undefined":
         return { type: "null", className: "text-center text-gray-400", data: null };
      default:
         return {
            type: "null",
            className: "text-center text-gray-400",
            data: null,
         };
      // case "null": return { type: 'null', className: "", format: () => <span>null</span> };
      // case "undefined": return { type: 'unknown', className: "", format: () => <span>undefined</span> };
   }
}

function getCommonPinningStyles<TData>(column: Column<TData>): CSSProperties {
   const isPinned = column.getIsPinned();

   return {
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      position: isPinned ? "sticky" : "relative",
      width: column.getSize(),
      maxWidth: `max(${column.getSize()}px,60svw)`,
      zIndex: isPinned ? 13 : 0,
   };
}
const columnResizeMode = "onEnd" satisfies ColumnResizeMode;
const columnResizeDirection = "ltr" satisfies ColumnResizeDirection;

export function DataTable({ fields = [], rows = [], editable = true }: DataTableProps) {
   const [hidden] = useQueryState(
      "hide",
      parseAsArrayOf(parseAsString).withDefault([]).withOptions({
         clearOnDefault: true,
         scroll: false,
      }),
   );

   const primaryKey = fields.find((x) => x.key_type === "PRIMARY KEY");
   const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
      left: ["$index", ...(primaryKey ? [primaryKey.name] : [])],
      right: [],
   });
   const columnVisibility = hidden.reduce<VisibilityState>((acc, cur) => ({ ...acc, [cur]: false }), {});

   const table = useReactTable({
      columns: [
         {
            accessorKey: "$index",
            header: "#",
            cell: ({ row }) => {
               return (
                  <span aria-description="index" className="z-[13] grid place-items-center truncate px-0 text-center">
                     {row.index + 1}
                  </span>
               );
            },
            minSize: 40,
            size: 40,
         },
         ...fields.map(
            (field) =>
               ({
                  accessorKey: field.name,
                  cell: ({ row, column }) => {
                     const id = (row.original as Record<string, string | number>)?.[primaryKey?.name || ""];
                     return (
                        <Cell
                           key={id}
                           id={id}
                           readOnly={!editable}
                           name={field.name}
                           position={field.position}
                           type={DatatypeToJavascript?.[field.type as keyof typeof DatatypeToJavascript] ?? "unknown"}
                           nullable={field.nullable == "YES"}
                           fallback={field.default}
                           defaultValue={row.getValue(column.id)}
                        />
                     );
                  },
                  header: field.name,
                  enableHiding: true,
               }) satisfies ColumnDef<unknown>,
         ),
      ],
      data: rows,
      getCoreRowModel: getCoreRowModel(),
      getFacetedRowModel: getFacetedRowModel(),
      initialState: {
         columnPinning,
         columnVisibility,
      },
      state: {
         columnPinning,
         columnVisibility,
      },
      onColumnPinningChange: setColumnPinning,
      onColumnVisibilityChange: undefined,

      columnResizeMode,
      columnResizeDirection,
   });

   return (
      <>
         <Table className="bg-background w-max" style={{ direction: columnResizeDirection }}>
            <THead>
               {table.getHeaderGroups().map((headerGroup) => (
                  <TRow key={headerGroup.id} className="bg-gray-100">
                     {headerGroup.headers.map((header, index) => {
                        return (
                           <Th
                              key={header.id}
                              data-pinned={header.column.getIsPinned() || undefined}
                              colSpan={header.colSpan}
                              className={cn("group bg-gray-100")}
                              style={{ ...getCommonPinningStyles(header.column) }}
                           >
                              {index > 0 ? (
                                 <DataTableColumnHeader
                                    id={header.id}
                                    column={header.column}
                                    // className={
                                    //    table.getState().columnSizingInfo.deltaOffset !== 0 ? "pointer-events-none" : ""
                                    // }
                                 >
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                 </DataTableColumnHeader>
                              ) : (
                                 flexRender(header.column.columnDef.header, header.getContext())
                              )}

                              <span
                                 className={cn(
                                    "absolute inset-y-0 z-50 h-full w-1 cursor-col-resize touch-none bg-transparent select-none ltr:right-0 rtl:left-0",
                                    header.column.getIsResizing() ? "bg-primary" : "hover:bg-primary",
                                 )}
                                 onDoubleClick={() => header.column.resetSize()}
                                 onMouseDown={header.getResizeHandler()}
                                 onTouchStart={header.getResizeHandler()}
                                 style={{
                                    transform: header.column.getIsResizing()
                                       ? `translateX(${
                                            (table.options.columnResizeDirection === "rtl" ? -1 : 1) *
                                            (table.getState().columnSizingInfo.deltaOffset ?? 0)
                                         }px)`
                                       : "",
                                 }}
                              />
                           </Th>
                        );
                     })}
                  </TRow>
               ))}
            </THead>
            <TBody>
               {table.getRowModel().rows?.map((row) => (
                  <TRow key={row.id} className="group/tr h-7 border-b-zinc-200 dark:border-b-zinc-800">
                     {row.getVisibleCells()?.map((cell) => {
                        return (
                           <Td
                              role="cell"
                              data-pinned={cell.column.getIsPinned() ? true : undefined}
                              key={cell.id}
                              className="bg-background group-hover/tr:text-foreground group/td focus-within:[&>div]:bg-accent focus-within:[&>div]:ring-c400 overflow-visible p-0 group-hover/tr:bg-gray-100 focus-within:z-10 focus-within:[&>div]:ring-1"
                              style={{ ...getCommonPinningStyles(cell.column) }}
                           >
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                           </Td>
                        );
                     })}
                  </TRow>
               ))}
            </TBody>
         </Table>
      </>
   );
}

type CellType = "date" | "boolean" | "number" | "string" | "array" | "json" | "null" | "unknown";
interface CellProps {
   id: string | number;
   name: string;
   position: number;
   type: CellType;
   nullable: boolean;
   fallback?: unknown;
   readOnly?: boolean;
   defaultValue: unknown;
}

function Cell({ id, name, type, nullable, defaultValue, readOnly }: CellProps) {
   const inputRef = useRef<HTMLInputElement | null>(null);
   const params = useParams<{ databaseId: string; tableName: string }>();

   const scriptId = useRef<string | undefined>(undefined);
   const { setDatabase, setScript, removeScript } = useScripts();

   const formatted = tableCellFormatter(defaultValue);

   const [focus, setFocus] = useState<boolean>(false);
   const [index, setIndex] = useState<number>(0);
   const [history, setHistory] = useState<(string | null)[]>([formatted.data]);

   const initial = history[0];
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
      setIndex((x) => x - 1);
      const undo = history[index - 1];

      // If hasn't an undo option
      if (undo === undefined) return;
      if (undo === initial) return clearScript();

      // Format the data to SQL format
      const sql = getSQL(undo!);
      if (!sql) return;

      // Append/update the script
      setScript(sql, {
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
      setIndex((x) => x + 1);
      const redo = history[index + 1];

      // If hasn't an redo option
      if (redo === undefined) return;
      if (redo === initial) return clearScript();

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

   function getSQL(current: string | null) {
      let sql = "";
      switch (type) {
         case "date": {
            const date = new Date(current ?? "");
            if (isNaN(date.getTime())) return;
            sql = `'${date.toISOString()}'`;
            break;
         }
         case "number": {
            const num = Number(current);
            if (isNaN(num)) return;
            sql = `${num}`;
            break;
         }
         case "boolean": {
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
         case "array": {
            try {
               const parsed = JSON.parse(current ?? "");
               sql = `'${JSON.stringify(parsed)}'`;
            } catch {
               return;
            }
            break;
         }
         case "string": {
            sql = `'${current ?? ""}'`;
            break;
         }
         default:
            break;
      }
      return `UPDATE ${params.tableName} SET ${name} = ${sql} WHERE id = ${id}`;
   }

   function handleOnBlur(current: string | null) {
      if (current === history[index]) return;
      if (current === initial) return clearScript();

      let sql = "";
      switch (type) {
         case "date": {
            const date = new Date(current as string);
            if (isNaN(date.getTime())) {
               current = value;
            }
            sql = `'${date.toISOString()}'`;
            break;
         }
         case "number": {
            const num = Number(current);
            if (isNaN(num)) {
               current = value;
            }
            sql = `${num}`;
            break;
         }
         case "boolean": {
            if (!["true", "false"].includes(current as string)) {
               current = value;
            }
            sql = `${current}`;
            break;
         }
         case "json": {
            try {
               JSON.parse(current as string);
               sql = `'${current}'`;
            } catch {
               current = value;
            }
            break;
         }
         case "array": {
            try {
               JSON.parse(current as string);
               sql = `'${current}'`;
            } catch {
               current = value;
            }
            break;
         }
         case "string":
            sql = `'${current}'`;
            break;
         case "null":
            sql = "NULL";
            break;
      }

      // Check if the value is valid base on the type of the data
      // if (inputRef.current) inputRef.current.value = current ?? "";

      setValue(current);
      setDatabase(params.databaseId);
      const script = `UPDATE ${params.tableName} SET ${name} = ${sql} WHERE id = ${id}`;

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

   useEffectAfterMount(() => {
      if (!inputRef.current) return;
      inputRef.current.value = value ?? "";
   }, [value]);

   return (
      <>
         <ContextMenu>
            <span className={cn("block w-full px-2 whitespace-nowrap", !readOnly && "invisible")}>{value}</span>
            {readOnly ? null : (
               <ContextMenuTrigger asChild>
                  <Input
                     ref={inputRef}
                     intent="none"
                     size="none"
                     data-changed={value != initial}
                     onFocusCapture={() => setFocus(true)}
                     onBlurCapture={() => setFocus(false)}
                     onBlur={(e) => handleOnBlur(e.currentTarget.value)}
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
                           e.currentTarget.value = value ?? "";
                           e.currentTarget.blur();
                        }
                        if (e.key === "Enter" && !e.ctrlKey) {
                           e.currentTarget.blur();
                        }
                     }}
                     className={cn(
                        "data-[changed='true']:!bg-primary/10 absolute inset-0 h-full w-full rounded-none px-2 overflow-ellipsis group-[data-pinned]:z-20",
                        focus && "bg-background",
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
               <div className="flex items-center justify-between gap-1 pr-1">
                  <ContextMenuLabel>Properties</ContextMenuLabel>
               </div>
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
                  onSelect={() => handleOnBlur(null)}
                  className="gap-2"
               >
                  <CircleDashed className="size-4 shrink-0" />
                  Set null
               </ContextMenuItem>
               {type === "boolean" ? (
                  <ContextMenuItem
                     disabled={value === null}
                     onSelect={() => handleOnBlur(value === "true" ? "false" : "true")}
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
         {/* {focus && <CellSelection ref={inputRef} />} */}
      </>
   );
}

// interface CellSelectionProps {
//    ref: RefObject<HTMLElement | null>;
// }
// export function CellSelection({ ref }: CellSelectionProps) {
//    const container = document.querySelector("div[data-scroll-container]");
//    if (!container) return null;

//    const rect = {
//       top:
//          (ref.current?.getBoundingClientRect().top ?? 0) -
//          (container.getBoundingClientRect().top ?? 0) +
//          (container.scrollTop ?? 0) -
//          1,
//       left:
//          (ref.current?.getBoundingClientRect().left ?? 0) -
//          (container.getBoundingClientRect().left ?? 0) +
//          (container.scrollLeft ?? 0) -
//          1,
//       width: (ref.current?.getBoundingClientRect()?.width ?? 0) + 2,
//       height: (ref.current?.getBoundingClientRect()?.height ?? 0) + 2,
//    };

//    return (
//       <Portal container={container}>
//          <span style={rect} className="border-primary pointer-events-none absolute z-[12] block border shadow-xs">
//             {/* <span className="bg-primary absolute -top-1 -right-1 size-2 rounded-xs" /> */}
//          </span>
//       </Portal>
//    );
// }

function ContextMenuItemWithTooltip({
   children,
   tooltip,
   ...props
}: React.ComponentPropsWithoutRef<typeof ContextMenuItem> & { tooltip?: string | React.ReactNode }) {
   return (
      <TooltipProvider>
         <Tooltip>
            <TooltipTrigger asChild>
               <ContextMenuItem {...props}>{children}</ContextMenuItem>
            </TooltipTrigger>
            <TooltipContent>{tooltip}</TooltipContent>
         </Tooltip>
      </TooltipProvider>
   );
}
