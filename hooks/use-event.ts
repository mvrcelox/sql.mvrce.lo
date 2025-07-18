import * as React from "react";
/**
 * Custom hook to add an event listener to the window.
 *
 * @param event - The name of the event to listen for.
 * @param callback - The function to call when the event is triggered.
 * @param deps - Optional dependencies for the effect.
 * @param options - Optional options for the event listener.
 */
export function useEvent(
   event: string,
   callback: (e: Event) => void,
   deps: React.DependencyList = [],
   options: AddEventListenerOptions = {},
) {
   React.useEffect(() => {
      if (event === "resize") {
         callback({} as Event);
      }

      window.addEventListener(event, callback, options);

      return () => window.removeEventListener(event, callback, options);
   }, deps);
}
