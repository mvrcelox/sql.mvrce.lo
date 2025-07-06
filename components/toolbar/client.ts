"use client";

import dynamic from "next/dynamic";

export const ThemeToggle = dynamic(() => import("@/components/theme-selector"), { ssr: false });
