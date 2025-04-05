"use client";

import Button, { buttonVariants } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
   ChevronRight,
   Database,
   Loader2,
   MoreVertical,
   Pencil,
   Plus,
   Search,
   Table2,
   Trash2,
   X,
   Zap,
   ZapOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import AddDatabaseDialog from "@/app/()/database/components/add-database-dialog";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { getDatabases, GetDatabasesReturn } from "@/models/databases";
import { toast } from "sonner";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import Expand from "@/app/components/ui/expand";
import { cn } from "@/lib/utils";
import { useSessionStorage } from "@uidotdev/usehooks";
import { usePathname } from "next/navigation";
import isNumber from "@/helpers/is-number";
import { useDatabasesStore } from "@/stores/databases";
import exportAsClient from "@/lib/export-as-client";

const Sidebar = exportAsClient(function () {
   const [search, setSearch] = useState<null | string>(null);
   // const { connecteds, connect } = useDatabasesStore();

   const { find, connect } = useDatabasesStore();

   const pathname = usePathname();

   const {
      data: databases,
      isLoading,
      refetch,
   } = useQuery({
      queryKey: ["databases"],
      queryFn: async () => {
         const [databases, error] = await getDatabases();

         if (error) {
            const statusCode = error?.data ? JSON.parse(error?.data).status_code : undefined;
            if (statusCode === 401) {
               const id = toast(error.message, {
                  action: (
                     <Link
                        href="/auth/sign-in"
                        onClick={() => {
                           toast.dismiss(id);
                        }}
                        className={buttonVariants({
                           intent: "none",
                           size: "xs",
                           className:
                              "ml-auto border border-neutral-600 bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100 dark:border-neutral-400 dark:bg-neutral-100 dark:text-neutral-700 dark:hover:bg-neutral-200 dark:hover:text-neutral-900",
                        })}
                     >
                        Sign in
                     </Link>
                  ),
               });
            } else {
               toast.error(error.message ?? "An non expected error happened");
            }

            return [];
         }

         return databases;
      },
      retry: 2,
   });

   useEffect(() => {
      if (!pathname) return;

      const databaseId = parseInt(pathname.split("/")[2]);
      if (!isNumber(databaseId)) return;

      const database = databases?.find((x) => x.id === databaseId);
      if (!database) return;

      connect(database);
   }, [pathname, connect, find, databases]);

   const [hide] = useSessionStorage<boolean>("sub-sidebar", false);

   // const [hide] = useQueryState("hide-sidebar", {
   //    clearOnDefault: true,
   //    defaultValue: false,
   //    eq: (a: boolean, b: boolean) => a == b,
   //    parse: (value: string) => (value === "true" ? true : false),
   // });

   return (
      <AnimatePresence>
         {hide ? null : (
            <motion.aside
               initial={{ marginLeft: "-18rem" }}
               animate={{ marginLeft: 0 }}
               exit={{ marginLeft: "-18rem" }}
               transition={{
                  type: "tween",
                  ease: "circInOut",
                  duration: 0.15,
               }}
               className="bg-background isolate flex w-full max-w-72 shrink-0 grow flex-col self-stretch overflow-hidden border-r"
            >
               {/* <div className="h-11 self-stretch border-b border-b-border" /> */}
               {search === null ? (
                  <div className="flex items-center justify-between gap-4 border-b p-1">
                     <span className="px-2 text-sm font-semibold text-gray-800 uppercase">Databases</span>
                     <div className="flex items-center">
                        <AddDatabaseDialog onSuccess={() => refetch()}>
                           <Button intent="ghost" size="none" className="size-8 shrink-0">
                              <Plus className="size-4 shrink-0" />
                           </Button>
                        </AddDatabaseDialog>
                        <Button
                           intent="ghost"
                           size="none"
                           className="size-8 shrink-0"
                           onClick={() => {
                              setSearch("");
                           }}
                        >
                           <Search className="size-4 shrink-0" />
                        </Button>
                     </div>
                  </div>
               ) : (
                  <div className="flex items-center gap-1 border-b p-1">
                     <Input
                        autoFocus
                        size="sm"
                        onChange={(e) => setSearch(e.currentTarget.value)}
                        value={search ?? ""}
                     />
                     <Button
                        intent="ghost"
                        size="none"
                        className="size-8 shrink-0"
                        onClick={() => {
                           setSearch(null);
                        }}
                     >
                        <X className="size-4 shrink-0" />
                     </Button>
                  </div>
               )}
               {/* <SidebarSearch /> */}
               <ul role="list" className="flex grow flex-col gap-1 self-stretch overflow-auto p-1">
                  {isLoading ? (
                     new Array(2)
                        .fill(null)
                        .map((x, idx) => (
                           <li
                              key={`skeleton-${idx}`}
                              className="group flex h-8 animate-pulse items-center gap-1 rounded bg-gray-200 px-1 text-sm transition-colors"
                           />
                        ))
                  ) : databases && databases?.length > 0 ? (
                     databases
                        ?.filter((x) => {
                           if (!search?.length) return true;
                           return x.name.toLowerCase().includes(search?.toLowerCase());
                        })
                        ?.map((database) => {
                           const found = find(database.id);
                           const state = found?.status ?? "disconnected";
                           return <DatabaseItem state={state} database={database} key={database.id} />;
                        })
                  ) : (
                     <div className="m-auto flex flex-col items-center gap-4">
                        <span className="rounded-md bg-gray-200 p-3">
                           <Database className="size-6 shrink-0" />
                        </span>
                        <span className="text-sm text-gray-500">No databases found.</span>
                     </div>
                  )}
               </ul>
            </motion.aside>
         )}
      </AnimatePresence>
   );
});

function DatabaseItem({ database, state }: { database: GetDatabasesReturn[number]; state: string }) {
   const { find, connect, disconnect } = useDatabasesStore();
   const found = find(database.id);

   return (
      <Expand.Root defaultOpen={false} open={state !== "connected" ? false : undefined} key={database.id}>
         <li
            role="listitem"
            data-state={state}
            className="group data-sta flex flex-col rounded text-sm transition-colors hover:bg-gray-100 has-[button[aria-pressed='true']]:bg-gray-200 has-[button[aria-pressed='true']]:[--display:flex]"
         >
            <div className="has-[button[aria-pressed='true']]:peer/title flex h-8 items-center justify-start gap-1 px-1">
               <Expand.Trigger
                  disabled={state === "connecting"}
                  intent="ghost"
                  size="none"
                  className="group/toggle peer/toggle size-6 rounded-sm bg-transparent hover:bg-gray-300"
                  onPressedChange={(pressed) => {
                     if (!pressed || found || state === "connecting" || state === "connected") return;
                     connect(database);
                  }}
               >
                  {state === "connecting" ? (
                     <Loader2 className="size-4 shrink-0 animate-spin" />
                  ) : (
                     <ChevronRight className="size-4 shrink-0 duration-150 group-aria-pressed/toggle:rotate-90" />
                  )}
               </Expand.Trigger>

               <span
                  className={cn(
                     "truncate text-gray-800",
                     state === "connecting" ? "pointer-events-none opacity-50" : null,
                  )}
               >
                  {database.name}
               </span>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button
                        intent="ghost"
                        size="none"
                        className="aria-expanded:text-foreground ml-auto size-6 rounded-sm text-gray-500 hover:bg-gray-300 hover:text-gray-700 aria-expanded:bg-gray-200"
                     >
                        <MoreVertical className="size-4 shrink-0 duration-150" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
                     {state === "disconnected" ? (
                        <>
                           <DropdownMenuItem
                              className="gap-2"
                              onSelect={() => {
                                 connect(database);
                              }}
                           >
                              <Zap className="size-4 shrink-0" />
                              Connect
                           </DropdownMenuItem>
                        </>
                     ) : state === "connected" ? (
                        <DropdownMenuItem
                           className="gap-2"
                           onSelect={() => {
                              disconnect(database.id);
                           }}
                        >
                           <ZapOff className="size-4 shrink-0" />
                           Disconnect
                        </DropdownMenuItem>
                     ) : null}

                     {/* <DropdownMenuItem>
               <Spline className="size-4 shrink-0" />
               Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem>
               <Star className="size-4 shrink-0" />
               Favorite
            </DropdownMenuItem>
            <DropdownMenuItem>
               <Share className="size-4 shrink-0" />
               Share
               </DropdownMenuItem>
               <DropdownMenuSeparator /> */}
                     {state === "disconnected" ? (
                        <>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                              className="gap-2"
                              onSelect={() => {
                                 connect(database);
                              }}
                           >
                              <Pencil className="size-4 shrink-0" />
                              Modify
                           </DropdownMenuItem>
                           <DropdownMenuItem>
                              <Trash2 className="size-4 shrink-0" />
                              Delete
                           </DropdownMenuItem>
                        </>
                     ) : null}
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>

            <Expand.Content className="p-1 pl-4">
               {/* Tables */}
               <Expand.Root defaultOpen={false}>
                  <div className="flex h-8 items-center gap-1 rounded-sm px-1 duration-150 hover:bg-gray-300 has-[button[aria-pressed='true']]:bg-gray-300">
                     <Expand.Trigger
                        intent="ghost"
                        size="none"
                        className="group/toggle size-6 rounded-xs bg-transparent hover:bg-gray-300"
                     >
                        {<ChevronRight className="size-4 shrink-0 duration-150 group-aria-pressed/toggle:rotate-90" />}
                     </Expand.Trigger>
                     <span className="text-gray-800">Tables</span>
                  </div>
                  <Expand.Content>
                     <ul role="list" className="flex grow flex-col self-stretch py-1 pl-4">
                        {found?.tables?.map((table) => (
                           <li key={table?.table_name}>
                              <Link
                                 href={`/database/${database.id}/table/${table.table_name}`}
                                 className={buttonVariants({
                                    intent: "ghost",
                                    size: "xs",
                                    className: "w-full justify-start gap-2 rounded-sm hover:bg-gray-300",
                                 })}
                              >
                                 <Table2 className="size-4 shrink-0 opacity-70" />
                                 <span className="truncate">{table?.table_name}</span>
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </Expand.Content>
               </Expand.Root>

               {/* Views */}
               <Expand.Root defaultOpen={false}>
                  <div className="flex h-8 items-center gap-1 rounded-sm px-1 duration-150 hover:bg-gray-300 has-[button[aria-pressed='true']]:bg-gray-300">
                     <Expand.Trigger
                        intent="ghost"
                        size="none"
                        className="group/toggle size-6 bg-transparent hover:bg-gray-300"
                     >
                        {<ChevronRight className="size-4 shrink-0 duration-150 group-aria-pressed/toggle:rotate-90" />}
                     </Expand.Trigger>
                     <span className="text-gray-800">Views</span>
                  </div>
                  <Expand.Content>
                     <ul role="list" className="flex grow flex-col self-stretch py-1 pl-4">
                        {found?.views?.map((view) => (
                           <li key={view?.table_name}>
                              <Link
                                 href={`/database/${database.id}/view/${view.table_name}`}
                                 className={buttonVariants({
                                    intent: "ghost",
                                    size: "xs",
                                    className: "w-full justify-start gap-2 rounded-sm hover:bg-gray-300",
                                 })}
                              >
                                 <Table2 className="size-4 shrink-0 opacity-70" />
                                 <span className="truncate">{view?.table_name}</span>
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </Expand.Content>
               </Expand.Root>

               {/* Indexes */}
               <Expand.Root defaultOpen={false}>
                  <div className="flex h-8 items-center gap-1 rounded-sm px-1 duration-150 hover:bg-gray-300 has-[button[aria-pressed='true']]:bg-gray-300">
                     <Expand.Trigger
                        intent="ghost"
                        size="none"
                        className="group/toggle size-6 bg-transparent hover:bg-gray-300"
                     >
                        {<ChevronRight className="size-4 shrink-0 duration-150 group-aria-pressed/toggle:rotate-90" />}
                     </Expand.Trigger>
                     <span className="text-gray-800">Indexes</span>
                  </div>
                  <Expand.Content>
                     <ul role="list" className="flex grow flex-col self-stretch py-1 pl-4">
                        {found?.indexes?.map((index) => (
                           <li key={index.indexname}>
                              <Link
                                 href="#"
                                 // href={`/database/${database.id}/indexes/${index.indexname}`}
                                 className={buttonVariants({
                                    intent: "ghost",
                                    size: "xs",
                                    className: "w-full justify-start gap-2 rounded-sm hover:bg-gray-300",
                                 })}
                              >
                                 <Table2 className="size-4 shrink-0 opacity-70" />
                                 <span className="truncate">{index.indexname}</span>
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </Expand.Content>
               </Expand.Root>

               {/* Sequences */}
               <Expand.Root defaultOpen={false}>
                  <div className="flex h-8 items-center gap-1 rounded-sm px-1 duration-150 hover:bg-gray-300 has-[button[aria-pressed='true']]:bg-gray-300">
                     <Expand.Trigger
                        intent="ghost"
                        size="none"
                        className="group/toggle size-6 bg-transparent hover:bg-gray-300"
                     >
                        {<ChevronRight className="size-4 shrink-0 duration-150 group-aria-pressed/toggle:rotate-90" />}
                     </Expand.Trigger>
                     <span className="text-gray-800">Sequences</span>
                  </div>
                  <Expand.Content>
                     <ul role="list" className="flex grow flex-col self-stretch py-1 pl-4">
                        {found?.sequences?.map((sequence) => (
                           <li key={sequence.sequencename}>
                              <Link
                                 href="#"
                                 // href={`/database/${database.id}/sequences/${sequence.sequencename}`}
                                 className={buttonVariants({
                                    intent: "ghost",
                                    size: "xs",
                                    className: "w-full justify-start gap-2 rounded-sm hover:bg-gray-300",
                                 })}
                              >
                                 <Table2 className="size-4 shrink-0 opacity-70" />
                                 <span className="truncate">{sequence.sequencename}</span>
                              </Link>
                           </li>
                        ))}
                     </ul>
                  </Expand.Content>
               </Expand.Root>
            </Expand.Content>
         </li>
      </Expand.Root>
   );
}

export { Sidebar };
