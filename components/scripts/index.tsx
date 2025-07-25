"use client";

import { createContext, useContext, useRef, useState } from "react";
import type { CallbackFn, Script, ScriptsContextProps } from "./types";
import { toast } from "sonner";

import { v4 as uuidv4 } from "uuid";
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import Button from "../ui/button";
import { ArrowRight, Copy, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { TextArea } from "../ui/textarea";
import { queryDatabase } from "@/models/databases";
import revalidate from "./actions";
export const ScriptsContext = createContext<ScriptsContextProps>({} as ScriptsContextProps);
export const useScripts = () => useContext(ScriptsContext);

export default function ScriptsProvider({ children }: React.PropsWithChildren) {
   const [open, setOpen] = useState<boolean>(false);
   const show = () => setOpen(true);
   const hide = () => setOpen(false);

   // const router = useRouter();

   const databaseRef = useRef<string | undefined>(undefined);
   const [databases, setDatabases] = useState<Script[]>([]);

   const setDatabase = (id: string) => (databaseRef.current = id);
   const currentDatabaseScripts = databaseRef.current
      ? (databases
           ?.find((x) => x.databaseId === databaseRef.current)
           ?.scripts?.reduce<string[]>((acc, cur) => [...acc, cur.sql], []) ?? [])
      : [];
   const currentDatabaseScript = currentDatabaseScripts.join("\n");

   const getScripts = () => {
      if (!databaseRef.current) return [];
      const dbIndex = databases?.findIndex((x) => x.databaseId === databaseRef.current);
      if (dbIndex === -1) return [];

      return databases[dbIndex]?.scripts?.reduce<string[]>((acc, cur) => [...acc, cur.sql], []);
   };

   const clearScripts = () => {
      if (!databaseRef.current) toast.error("Database wasn't selected.");

      const index = databases?.findIndex((x) => x.databaseId === databaseRef.current);
      if (index === -1) toast.error("Database not found or doesn't exists 2");

      for (const script of databases[index].scripts) {
         script.callback?.("clear");
      }

      setDatabases((databases) => {
         databases[index].scripts = [];
         return [...databases];
      });
   };

   const setScript = (
      sql: string,
      options?: {
         id?: string;
         callback?: CallbackFn | undefined;
      },
   ) => {
      const databaseId = databaseRef.current;
      if (!databaseId) {
         toast.error(`Database wasn't selected.`);
         return;
      }

      const dbIndex = databases.findIndex((y) => y.databaseId === databaseId);
      const { id = uuidv4(), callback } = options ?? {};

      const script = { id, sql, callback };
      if (dbIndex === -1) {
         databases.push({ databaseId, scripts: [script] });
         setDatabases([...databases]);
         return id;
      }

      const scriptIndex = databases[dbIndex].scripts.findIndex((y) => y.id === id);
      if (scriptIndex === -1) {
         databases[dbIndex].scripts.push(script);
         setDatabases([...databases]);
         return id;
      }

      databases[dbIndex].scripts[scriptIndex] = script;
      setDatabases([...databases]);
      return id;
   };

   const appendScript = (sql: string, callback?: CallbackFn | undefined) => {
      const databaseId = databaseRef.current;
      if (!databaseId) {
         toast.error(`Database wasn't selected.`);
         return;
      }

      const scriptId = uuidv4();
      const index = databases.findIndex((y) => y.databaseId === databaseRef.current);

      if (index !== -1) {
         databases[index].scripts.push({ id: scriptId, sql, callback });
      } else {
         databases.push({ databaseId: databaseId, scripts: [{ id: scriptId, sql, callback }] });
      }
      setDatabases(databases);
      return scriptId;
   };

   const updateScript = (sql: string, scriptId: string, callback?: CallbackFn | undefined) => {
      const databaseId = databaseRef.current;
      if (!databaseId) {
         toast.error("Database wasn't selected");
         return;
      }

      try {
         const databaseIndex = databases.findIndex((x) => x.databaseId === databaseId);
         if (databaseIndex === -1) throw `Database not found or doesn't exists.`;

         const scriptIndex = databases[databaseIndex].scripts.findIndex((script) => script.id === scriptId);
         if (scriptIndex === -1) throw "Script not found or doesn't exists.";

         databases[databaseIndex].scripts[scriptIndex] = { sql, id: scriptId, callback };

         setDatabases(databases);
         return databases[databaseIndex].scripts[scriptIndex].id;
      } catch (error) {
         console.error(error);
         toast.error(error as string);
         return;
      }
   };

   const removeScript = (id: string) => {
      const databaseId = databaseRef.current;
      if (!databaseRef.current) {
         toast.error("Database wasn't selected");
         return;
      }

      try {
         const index = databases.findIndex((x) => x.databaseId === databaseId);
         if (index === -1) {
            throw "Database not found or doesn't exists.";
         }

         const script = databases[index].scripts.findIndex((script) => script.id === id);
         if (script === -1) throw "Script not found or doesn't exists.";

         databases[index].scripts = databases[index].scripts.filter((script) => script.id !== id);
         setDatabases([...databases]);
      } catch (error) {
         toast.error(error as string);
      }
   };

   const script = databaseRef.current
      ? databases
           ?.find((x) => x.databaseId === databaseRef.current)
           ?.scripts?.reduce<string[]>((acc, cur) => [...acc, cur.sql], [])
           .join("\n")
      : "";

   const textarea = useRef<HTMLTextAreaElement>(null);
   const { mutate: run, isPending: isRunning } = useMutation({
      mutationKey: ["run-script", databases],
      mutationFn: async (script: string | undefined) => {
         const databaseId = databaseRef.current;

         if (!databaseId) {
            toast.error("Database wasn't selected.");
            return;
         }

         if (!script) {
            toast.error("Script is empty.");
            return;
         }

         console.log({ databaseId });
         const [, err] = await queryDatabase({ databaseId, sql: script });
         if (err) {
            console.error(err);
            toast.error(err.message);
            return;
         }

         setOpen(false);
         setDatabases((database) => database.filter((y) => y.databaseId != databaseId));

         // Find the current database in databases to clear their scripts
         const index = databases.findIndex((database) => database.databaseId === databaseId);
         if (index === -1) return;

         for (const script of databases[index].scripts) {
            if (typeof script?.callback !== "function") continue;
            script.callback?.("run");
         }
         revalidate(window.location.pathname);
      },
   });

   return (
      <ScriptsContext.Provider
         value={{
            scripts: currentDatabaseScripts,
            getScripts,
            clearScripts,
            setScript,
            appendScript,
            updateScript,
            removeScript,
            setDatabase,
            show,
            hide,
         }}
      >
         {children}

         <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Scripts editor</DialogTitle>
               </DialogHeader>
               <DialogBody>
                  <TextArea
                     defaultValue={script}
                     onChange={(e) => {
                        if (!textarea.current) return;
                        textarea.current.value = e.target.value;
                     }}
                     ref={textarea}
                     className="scroll w-full resize-none whitespace-pre lg:h-24.5"
                  />
               </DialogBody>
               <DialogFooter className="xs:flex-row-reverse xs:justify-between flex-col">
                  <div className="xxs:flex-row-reverse xxs:items-center flex flex-col gap-2">
                     <Button
                        disabled={isRunning}
                        intent="primary"
                        className="xxs:max-xs:grow gap-2"
                        onClick={() => run(textarea?.current?.value ?? "")}
                     >
                        Run
                        {isRunning ? (
                           <Loader2 className="size-4 shrink-0 animate-spin" />
                        ) : (
                           <ArrowRight className="size-4 shrink-0" />
                        )}
                     </Button>
                     <Button
                        intent="outline"
                        className="gap-2 bg-gray-50"
                        onClick={() => {
                           navigator.clipboard.writeText(currentDatabaseScript);
                           toast("Script copied to clipboard");
                        }}
                     >
                        <Copy className="size-4 shrink-0" />
                        Copy
                     </Button>
                  </div>
                  <Button
                     intent="ghost"
                     onClick={() => {
                        setOpen(false);
                     }}
                  >
                     Discard
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </ScriptsContext.Provider>
   );
}
