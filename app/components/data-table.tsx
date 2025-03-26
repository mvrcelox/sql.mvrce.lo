"use client";

import { DataTableColumnHeader } from "@/app/components/data-table-column-header";
import { Table, TBody, Td, Th, THead, TRow } from "@/app/components/ui/table";
import { cn } from "@/lib/utils";
import { CircleCheck, CircleDashed, CircleSlash, Redo, RotateCcw, Undo } from "lucide-react";
import { FieldDef } from "pg";

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
import { CSSProperties, useEffect, useRef, useState } from "react";
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
import { useHistoryState } from "@/hooks/use-history-state";
// import { useHistory } from "@/hooks/use-history";

export interface GenericFieldProps {
   columnID: number;
   dataTypeID: number;
   dataTypeSize: number;
   format: string;
   name: string;
   tableID: number;
}

export interface DataTableProps {
   fields?: FieldDef[];
   rows?: Record<string, unknown>[];
   defaultHeader?: boolean;
   editable?: boolean;
}

interface TableCellFormatterReturn {
   type: "date" | "boolean" | "number" | "string" | "array" | "json" | "null" | "unknown";
   data: string;
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
         if (cell === null) return { type: "null", className: "text-center text-gray-400", data: "[NULL]" };
         if (Array.isArray(cell)) return { type: "array", data: JSON.stringify(cell) };
         if (cell instanceof Date) return { type: "date", data: cell?.toISOString() };
         return { type: "json", data: JSON.stringify(cell) };
      }
      case "undefined":
         return { type: "null", className: "text-center text-gray-400", data: "[NULL]" };
      default:
         return {
            type: "null",
            className: "text-center text-gray-400",
            data: "[NULL]",
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
      zIndex: isPinned ? 1 : 0,
   };
}
const columnResizeMode = "onEnd" satisfies ColumnResizeMode;
const columnResizeDirection = "ltr" satisfies ColumnResizeDirection;

function Cell({
   name,
   row,
   editable,
}: {
   type?: string;
   name: string;
   editable?: boolean;
   row: { original: unknown; getValue: (name: string) => string };
}) {
   const inputRef = useRef<HTMLInputElement | null>(null);
   const params = useParams<{ databaseId: string; tableName: string }>();

   const scriptId = useRef<string | undefined>(undefined);
   const { setDatabase, appendScript, updateScript, removeScript } = useScripts();

   const rowId = (row.original as { id: string | number }).id;
   const cell = row.getValue(name);
   const formatted = tableCellFormatter(cell);

   const {
      value,
      setValue,
      initialValue,
      previewUndo,
      canUndo,
      undo: _undo,
      previewRedo,
      canRedo,
      redo: _redo,
      reset: _reset,
   } = useHistoryState<string | null>(formatted.data);

   function undo() {
      _undo();

      // if the undo has no changes from actual value
      if (previewUndo === initialValue) {
         if (!scriptId.current) return;
         // Clear the current script on sql editor and their id stored
         removeScript(scriptId.current);
         scriptId.current = undefined;
         return;
      }

      // Format the data to SQL format
      const sql = getSQL(previewUndo!);
      if (!sql) return;

      // Append/update the script
      if (scriptId.current)
         updateScript(sql, scriptId.current, (method) => {
            scriptId.current = undefined;
            switch (method) {
               case "run": {
                  console.log("running");
                  reset(previewUndo!);
                  break;
               }
               case "clear": {
                  console.log("clearing");
                  reset();
                  break;
               }
            }
         });
      else scriptId.current = appendScript(sql);
   }

   function redo() {
      _redo();

      // If the redo value has no changes from actual value
      if (previewRedo === initialValue) {
         if (!scriptId.current) return;

         // Clear the current script on sql editor and their id stored
         removeScript(scriptId.current);
         scriptId.current = undefined;
         return;
      }

      // Format the data to SQL format
      const sql = getSQL(previewRedo!);
      if (!sql) return;

      // Append/update the script
      if (scriptId.current)
         updateScript(sql, scriptId.current, (method) => {
            scriptId.current = undefined;
            switch (method) {
               case "run": {
                  console.log("running");
                  reset(previewRedo!);
                  break;
               }
               case "clear": {
                  console.log("clearing");
                  reset();
                  break;
               }
            }
         });
      else scriptId.current = appendScript(sql);
   }

   function reset(value?: typeof initialValue) {
      _reset(value);
      if (scriptId.current) removeScript(scriptId.current);
   }

   function getSQL(current: string) {
      let sql = "";
      switch (formatted.type) {
         case "date": {
            const date = new Date(current);
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
            if (!["true", "false"].includes(current)) return;
            sql = `${current}`;
            break;
         }
         case "json": {
            try {
               JSON.parse(current);
               sql = `'${current}'`;
            } catch {
               return;
            }
            break;
         }
         case "array": {
            try {
               JSON.parse(current);
               sql = `'${current}'`;
            } catch {
               return;
            }
            break;
         }
         case "string": {
            sql = `'${current}'`;
            break;
         }
         default:
            break;
      }
      return `UPDATE ${params.tableName} SET ${name} = ${sql} WHERE id = ${rowId}`;
   }

   function handleOnBlur(current: string | null) {
      let sql = "";

      if (current === value) return;
      if (current === initialValue) {
         setValue(current);
         if (scriptId.current) {
            removeScript(scriptId.current);
            scriptId.current = undefined;
         }
         return;
      }

      if (current === null) sql = `NULL`;

      if (current === "" && value === null) return;

      console.log(formatted.type);
      switch (formatted.type) {
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
      }

      // Check if the value is valid base on the type of the date
      if (current === value) {
         if (inputRef.current) inputRef.current.value = current ?? "";
         return;
      }

      setValue(current);
      setDatabase(params.databaseId);

      const script = `UPDATE ${params.tableName} SET ${name} = ${sql} WHERE id = ${rowId}`;

      if (scriptId.current && value !== initialValue) {
         const res = updateScript(script, scriptId.current, (method) => {
            scriptId.current = undefined;
            switch (method) {
               case "run": {
                  console.log("running");
                  reset(current);
                  break;
               }
               case "clear": {
                  console.log("clearing");
                  reset();
                  break;
               }
            }
         });
         if (!res) scriptId.current = undefined;
         return;
      }

      const uuid = appendScript(script, (method) => {
         scriptId.current = undefined;
         switch (method) {
            case "run": {
               console.log("running");
               reset(current);
               break;
            }
            case "clear": {
               console.log("clearing");
               reset();
               break;
            }
         }
      });
      scriptId.current = uuid;

      return;
   }

   useEffect(() => {
      if (typeof window === "undefined") return;
      if (inputRef.current) inputRef.current.value = value ?? "";
   }, [value]);

   return (
      <ContextMenu>
         <span className={cn("block w-full px-2 whitespace-nowrap", editable && "invisible")}>{value}</span>
         {editable ? (
            <ContextMenuTrigger asChild>
               <Input
                  ref={inputRef}
                  intent="none"
                  size="none"
                  data-changed={value != initialValue}
                  onBlur={(e) => {
                     // Always handle blur since !isTrusted is unreliable
                     handleOnBlur(e.currentTarget.value);
                  }}
                  onKeyDown={(e) => {
                     // if (e.key === "Z")
                     if (e.key === "Escape") {
                        e.currentTarget.value = value ?? "";
                        e.currentTarget.blur();
                     }
                     if (e.key === "Enter" && !e.ctrlKey) {
                        e.currentTarget.blur();
                     }
                  }}
                  className={cn(
                     "data-[changed='true']:!bg-primary/10 absolute inset-0 h-full w-full rounded-none px-2 overflow-ellipsis",
                     value === null
                        ? "placeholder-shown:not-focus:text-center placeholder-shown:focus:placeholder:text-transparent"
                        : "",
                  )}
                  placeholder={value === null ? "[NULL]" : undefined}
                  defaultValue={value ?? ""}
               />
            </ContextMenuTrigger>
         ) : null}
         <ContextMenuContent onCloseAutoFocus={(e) => e.preventDefault()}>
            <ContextMenuLabel>Actions</ContextMenuLabel>

            <ContextMenuItem disabled={value === null} onSelect={() => handleOnBlur(null)} className="gap-2">
               <CircleDashed className="size-4 shrink-0" />
               Set null
            </ContextMenuItem>
            {formatted.type === "boolean" ? (
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
            <ContextMenuSeparator />
            <ContextMenuItem
               disabled={!canUndo}
               onSelect={() => {
                  if (!canUndo) return;
                  undo();
               }}
               className="gap-2"
            >
               <Undo className="size-4 shrink-0" />
               Undo
            </ContextMenuItem>
            <ContextMenuItem
               disabled={!canRedo}
               onSelect={() => {
                  if (!canRedo) return;
                  redo();
               }}
               className="gap-2"
            >
               <Redo className="size-4 shrink-0" />
               Redo
            </ContextMenuItem>
            <ContextMenuItem disabled={!canRedo && !canUndo} onSelect={() => reset()} className="gap-2">
               <RotateCcw className="size-4 shrink-0" />
               Reset
            </ContextMenuItem>
         </ContextMenuContent>
         {/* {editable ? (
         ) : null} */}
      </ContextMenu>
   );
}

export const DataTable = ({ fields = [], rows = [], editable = true }: DataTableProps) => {
   const [hidden] = useQueryState(
      "hide",
      parseAsArrayOf(parseAsString).withDefault([]).withOptions({
         clearOnDefault: true,
         scroll: false,
      }),
   );

   const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({ left: ["$index"], right: [] });

   const columnVisibility = hidden.reduce<VisibilityState>((acc, cur) => ({ ...acc, [cur]: false }), {});

   const table = useReactTable({
      columns: [
         {
            accessorKey: "$index",
            header: "#",
            cell: ({ row }) => {
               return (
                  <span aria-description="index" className="block px-0 text-center">
                     {row.index + 1}
                  </span>
               );
            },
            minSize: 40,
            size: 40,
         },
         ...fields
            // ?.filter((x) => (hidden.includes(x.name) ? false : true))
            .map(
               (field) =>
                  ({
                     accessorKey: field.name,
                     cell: ({ row }: { row: { original: unknown; getValue: (name: string) => string } }) => (
                        <Cell name={field.name} row={row} editable={editable} />
                     ),
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
                              colSpan={header.colSpan}
                              className={cn("group", index === 0 ? "bg-gray-100" : "bg-transparent")}
                              style={{ ...getCommonPinningStyles(header.column) }}
                           >
                              <>
                                 {index > 0 ? (
                                    <DataTableColumnHeader
                                       id={header.id}
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
                              </>
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
                              key={cell.id}
                              className="bg-background group-hover/tr:text-foreground focus-within:[&>div]:bg-accent focus-within:[&>div]:ring-c400 relative overflow-visible p-0 group-hover/tr:bg-gray-100 focus-within:z-10 focus-within:[&>div]:ring-1"
                              style={{ ...getCommonPinningStyles(cell.column) }}
                           >
                              {/* <div role="cell" className="pointer-events-none absolute inset-0 h-full w-full" /> */}
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
};
