"use client";
import dynamic from "next/dynamic";

export const Sidebar = dynamic(() => import("@/components/sidebars/databases-sidebar"), { ssr: false });
