"use client";

import dynamic from "next/dynamic";
const DatabasesSidebar = dynamic(() => import("@/components/sidebars/databases-sidebar"), {
   ssr: false,
});

export default function LayoutClientOnly() {
   return <DatabasesSidebar />;
}
