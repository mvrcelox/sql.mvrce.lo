import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function useStorage<T>(key: string, initialValue?: T): [T, Dispatch<SetStateAction<T>>] {
   const [value, setValue] = useState<T>(() => {
      if (typeof window === "undefined") return initialValue;
      const storedValue = window.localStorage.getItem(key);

      try {
         return JSON.parse(storedValue || "") ?? initialValue;
      } catch {
         return initialValue;
      }
   });

   useEffect(() => {
      if (typeof window === "undefined") return;
      function onstorage(e: StorageEvent) {
         if (e.key !== key) return;
         const newValue = e.newValue ? JSON.parse(e.newValue) : initialValue;
         setValue(newValue);
      }

      window.addEventListener("storage", onstorage);

      return () => window.removeEventListener("storage", onstorage);
   }, [key, initialValue]);

   function handleSetValue(newValue: T | SetStateAction<T>) {
      switch (typeof newValue) {
         case "undefined":
            window.localStorage.removeItem(key);
            setValue(initialValue as T);
            return;
         case "function":
            newValue = (newValue as (prev: T) => T)(value);
      }
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
      window.dispatchEvent(
         new StorageEvent("storage", {
            key,
            oldValue: JSON.stringify(value),
            newValue: JSON.stringify(newValue),
         }),
      );
   }

   return [value, handleSetValue];
}
