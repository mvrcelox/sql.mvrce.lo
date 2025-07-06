"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>) {
   return (
      <CommandPrimitive
         data-slot="command"
         className={cn(
            "bg-background text-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
            className,
         )}
         {...props}
      />
   );
}

function CommandDialog({
   title = "Command Palette",
   description = "Search for a command to run...",
   children,
   ...props
}: React.ComponentProps<typeof Dialog> & {
   title?: string;
   description?: string;
}) {
   return (
      <Dialog {...props}>
         <DialogHeader className="sr-only">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
         </DialogHeader>
         <DialogContent className="overflow-hidden p-0">
            <Command className="**:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
               {children}
            </Command>
         </DialogContent>
      </Dialog>
   );
}

function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>) {
   return (
      <div data-slot="command-input-wrapper" className="relative flex h-12 items-center gap-2 border-b">
         <Search className="pointer-events-none absolute top-4 left-3 size-4 shrink-0 text-gray-500" />
         <CommandPrimitive.Input
            data-slot="command-input"
            className={cn(
               "flex h-full w-full rounded-md bg-transparent pr-3 pl-10 text-sm outline-hidden placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
               className,
            )}
            {...props}
         />
      </div>
   );
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>) {
   return (
      <CommandPrimitive.List
         data-slot="command-list"
         className={cn("max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto p-1", className)}
         {...props}
      />
   );
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>) {
   return (
      <CommandPrimitive.Empty
         data-slot="command-empty"
         className={cn("py-6 text-center text-sm text-gray-600", className)}
         {...props}
      />
   );
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>) {
   return (
      <CommandPrimitive.Group
         data-slot="command-group"
         className={cn(
            "overflow-hidden text-gray-700 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500",
            className,
         )}
         {...props}
      />
   );
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>) {
   return (
      <CommandPrimitive.Separator
         data-slot="command-separator"
         className={cn("-mx-1 my-1 h-px bg-gray-200", className)}
         {...props}
      />
   );
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>) {
   return (
      <CommandPrimitive.Item
         data-slot="command-item"
         className={cn(
            "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-[selected=true]:bg-gray-100 data-[selected=true]:text-gray-900 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-gray-500",
            className,
         )}
         {...props}
      />
   );
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
   return (
      <span
         data-slot="command-shortcut"
         className={cn("ml-auto text-xs tracking-widest text-gray-500 dark:text-gray-400", className)}
         {...props}
      />
   );
}

export {
   Command,
   CommandDialog,
   CommandInput,
   CommandList,
   CommandEmpty,
   CommandGroup,
   CommandItem,
   CommandShortcut,
   CommandSeparator,
};
