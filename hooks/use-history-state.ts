"use client";

import { useCallback, useMemo, useState } from "react";

export function useHistoryState<T>(initialValue: T) {
   const [history, setHistory] = useState<T[]>([initialValue]);
   const [index, setIndex] = useState<number>(0);
   const initialValueState = useMemo(() => history[0], [history]);

   const reset = useCallback((value?: T) => {
      setHistory(value ? [value] : (h) => [...h.slice(0, 1)]);
      setIndex(0);
   }, []);

   const value = history[index];
   const setValue = useCallback(
      (value: T) => {
         const h = JSON.parse(JSON.stringify(history)).slice(0, index + 1);
         h.push(value);
         setHistory(h);
         setIndex(h.length - 1);
      },
      [history, index],
   );

   const canUndo = useMemo(() => index > 0, [index]);
   const previewUndo = canUndo ? history[index - 1] : undefined;
   const undo = useCallback(() => {
      const i = Math.max(index - 1, 0);
      setIndex(i);
   }, [index]);

   const canRedo = index < history.length - 1;
   const previewRedo = canRedo ? history[index + 1] : undefined;
   const redo = useCallback(() => {
      const i = Math.min(index + 1, history.length - 1);
      setIndex(i);
   }, [history, index]);

   return {
      history,
      value,
      setValue,
      initialValue: initialValueState,
      previewUndo,
      canUndo,
      undo,
      previewRedo,
      canRedo,
      redo,
      reset,
   };
}
