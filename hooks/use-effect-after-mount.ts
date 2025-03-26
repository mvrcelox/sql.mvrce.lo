import { useEffect, useRef } from "react";

export default function useEffectAfterMount(fn: () => void, deps: unknown[] = []) {
   const isMounted = useRef(false);

   useEffect(() => {
      if (!isMounted.current) {
         isMounted.current = true;
         return;
      }

      fn();
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, deps);
}
