"use client";
import dynamic from "next/dynamic";

export const Sidebar = dynamic(() => import("./components/sidebar"), { ssr: false });
