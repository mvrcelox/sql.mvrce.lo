"use client";

import dynamic from "next/dynamic";

export const ThemeToggle = dynamic(() => import("@/app/components/theme-selector"), { ssr: false });
