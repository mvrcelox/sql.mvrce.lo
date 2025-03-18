"use client";

import assert from "assert";
import { useRef, useState } from "react";

export function useHistoryState<T>(initialValue: T) {
   const defaultValue = useRef<T>(initialValue);

   const [history, setHistory] = useState<T[]>([defaultValue.current]);
   const [index, setIndex] = useState<number>(0);

   function reset(value?: T) {
      assert(typeof value !== typeof initialValue, "Reset with a different type");
      const h = value ? [value] : history.slice(0, 1);
      setHistory(h);
      setIndex(0);
   }

   const value = history[index];
   function setValue(value: T) {
      const h = [...history.slice(0, index + 1), value];
      setHistory(h);
      setIndex(h.length - 1);
   }

   const canUndo = index > 0;
   const previewUndo = canUndo ? history[index - 1] : undefined;
   const undo = () => {
      const i = Math.max(index - 1, 0);
      setIndex(i);
      return history[i];
   };

   const canRedo = index < history.length - 1;
   const previewRedo = canRedo ? history[index + 1] : undefined;
   function redo() {
      const i = Math.min(index + 1, history.length - 1);
      setIndex(i);
      return history[i];
   }

   return {
      value,
      setValue,
      initialValue: history[0],
      previewUndo,
      canUndo,
      undo,
      previewRedo,
      canRedo,
      redo,
      reset,
   };
}
