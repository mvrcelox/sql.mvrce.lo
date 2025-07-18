import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
   CommandSeparator,
} from "@/components/ui/command";
import { JSX, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import Button from "./ui/button";
import { Gauge, LucideIcon, Table, Terminal } from "lucide-react";

interface LinkItem {
   label: string;
   slug?: string;
   icon: LucideIcon;
   href: string;
   section?: never;
}
interface SectionItem {
   label: string;
   slug?: string;
   icon: LucideIcon;
   href?: never;
   section: string;
}

type Item = LinkItem | SectionItem | "separator";

interface Section {
   title: string;
   items: Item[];
}

const sections = [
   {
      title: "Navigation",
      items: [
         {
            icon: Gauge,
            label: "Dashboard",
            href: "/dashboard",
         },
         {
            icon: Table,
            label: "Databases",
            href: "/databases",
         },
         {
            icon: Terminal,
            label: "Terminals",
            href: "/terminals",
         },
      ],
   },
   {
      title: "Theme",
      items: [],
   },
] satisfies Section[];

export default function CommandMenu({ children }: { children?: JSX.Element }) {
   const [open, setOpen] = useState(false);
   const [searchValue, setSearchValue] = useState("");

   const [currentSection] = useState("");

   // Toggle the menu when ⌘K is pressed
   useEffect(() => {
      function down(e: KeyboardEvent) {
         if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            setOpen((open) => !open);
         }
      }

      document.addEventListener("keydown", down);
      return () => document.removeEventListener("keydown", down);
   }, []);

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         {children && <DialogTrigger asChild>{children}</DialogTrigger>}
         <DialogHeader className="sr-only">
            <DialogTitle>Command Menu</DialogTitle>
         </DialogHeader>
         <DialogContent dismissable={false} className="mt-[16vh] max-w-3xl self-start">
            <Command>
               <div className="flex items-center gap-1 px-2 pt-2 empty:hidden">
                  {currentSection && (
                     <span className="z-1 rounded bg-gray-200 px-1.5 py-0.5 text-sm text-gray-700 hover:text-gray-800">
                        {currentSection}
                     </span>
                  )}
               </div>
               <div className="relative">
                  <CommandInput
                     className="pr-13"
                     placeholder="Search for anything"
                     value={searchValue}
                     onValueChange={setSearchValue}
                  />
                  <Button
                     intent="outline"
                     size="none"
                     className="absolute top-[.8125rem] right-3 h-auto rounded border-gray-200 px-1.5 py-0.5 text-xs text-gray-500"
                     onClick={() => setOpen(false)}
                  >
                     Esc
                  </Button>
               </div>
               <CommandList>
                  <CommandEmpty className="flex items-center justify-center px-16">
                     Nothing found for &quot;
                     <span className="text-foreground inline-block w-fit max-w-96 truncate">{searchValue}</span>
                     &quot;.
                  </CommandEmpty>

                  {sections.map((section) => {
                     if (!currentSection)
                        return (
                           <CommandGroup key={section.title} heading={section.title}>
                              {section.items.map((item, index) => {
                                 if (typeof item === "string" && item === "separator")
                                    return <CommandSeparator key={"separator-" + index} />;
                                 return (
                                    <CommandItem key={item.label.toLowerCase().replace(/ /g, "-")} className="py-2">
                                       <item.icon className="size-4 shrink text-gray-500" />
                                       {item.label}
                                    </CommandItem>
                                 );
                              })}
                           </CommandGroup>
                        );
                     // const isRight = section.items.some((item) => item.title === currentSection);
                     // if (!isRight) return null;

                     return <CommandItem key={section.title}>Olá</CommandItem>;
                  })}

                  <CommandItem>Apple</CommandItem>
               </CommandList>
            </Command>
         </DialogContent>
      </Dialog>
   );
}
