export type CallbackFn = (method: "clear" | "run") => void;

export interface ScriptsContextProps {
   setDatabase: (databaseId: string) => void;

   scripts: string[];
   getScripts: () => string[];
   clearScripts: () => void;

   appendScript: (sql: string, callback?: CallbackFn | undefined) => string | undefined;
   updateScript: (sql: string, scriptId: string, callback?: CallbackFn | undefined) => string | undefined;
   removeScript: (scriptId: string) => void | undefined;

   show: () => void;
   hide: () => void;
}

export interface Script {
   databaseId: string;
   scripts: InnerScript[];
}

interface InnerScript {
   id: string;
   sql: string;
   callback?: CallbackFn | undefined;
}
