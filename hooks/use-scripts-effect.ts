import { useEffect } from "react";
import ScriptsObserver from "@/controllers/scripts";

export const useScriptsEffect = (callback: () => void) => {
   useEffect(() => {
      const unsubscribe = ScriptsObserver.subscribe(callback);
      return unsubscribe;
   }, [callback]);
};
