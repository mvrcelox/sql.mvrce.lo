"use client";
import dynamic from "next/dynamic";

export const Sidebar = dynamic(() => import("@/app/components/sidebar"), { ssr: false });
