"use client";

export default function exportAsClient<T extends () => React.ReactNode>(
   component: T,
   loading: () => React.ReactNode = () => null,
): T {
   if (typeof window === "undefined") return loading as T;
   return component;
}
