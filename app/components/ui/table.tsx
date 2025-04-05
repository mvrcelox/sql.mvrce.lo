import React from "react";

import { cn } from "@/lib/utils";

export const TableWrapper = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
   ({ className, ...props }, ref) => {
      return <div ref={ref} {...props} className={cn("w-full grow overflow-x-auto", className)} />;
   },
);
TableWrapper.displayName = "TableWrapper";

export const Table = React.forwardRef<HTMLTableElement, React.ComponentPropsWithoutRef<"table">>(
   ({ className, ...props }, ref) => {
      return (
         <table
            ref={ref}
            className={cn("border-separate border-spacing-0 overflow-x-auto text-sm text-gray-800", className)}
            {...props}
         />
      );
   },
);
Table.displayName = "Table";

export const THead = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<"thead">>(
   ({ className, ...props }, ref) => {
      return (
         <thead ref={ref} className={cn("sticky top-0 left-0 z-20 h-9 border-b bg-gray-100", className)} {...props} />
      );
   },
);
THead.displayName = "Thead";

export const TBody = React.forwardRef<HTMLTableSectionElement, React.ComponentPropsWithoutRef<"tbody">>(
   ({ className, ...props }, ref) => {
      return <tbody className={cn(className)} {...props} ref={ref} />;
   },
);
TBody.displayName = "Tbody";

export const TRow = React.forwardRef<HTMLTableRowElement, React.ComponentPropsWithoutRef<"tr">>(
   ({ className, ...props }, ref) => {
      return <tr className={cn("[&>td]:border-b", className)} {...props} ref={ref} />;
   },
);
TRow.displayName = "TRow";

export const Th = React.forwardRef<HTMLTableCellElement, React.ComponentPropsWithoutRef<"th">>(
   ({ className, ...props }, ref) => {
      return (
         <th
            className={cn("border-r border-b bg-gray-100 px-3 text-left font-medium", className)}
            {...props}
            ref={ref}
         />
      );
   },
);
Th.displayName = "Th";

export const Td = React.forwardRef<HTMLTableDataCellElement, React.ComponentPropsWithoutRef<"td">>(
   ({ className, ...props }, ref) => {
      return <td ref={ref} className={cn("h-[calc(1.75rem+1px)] truncate border-r px-2", className)} {...props} />;
   },
);
Td.displayName = "Td";
