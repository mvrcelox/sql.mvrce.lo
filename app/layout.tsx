import type { Metadata, Viewport } from "next";
import { Geist, Plus_Jakarta_Sans } from "next/font/google";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ReactQueryProvider } from "@/components/react-query-provider";
import Provider from "./provider";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
   variable: "--font-plus-jakarta-sans",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: {
      default: "mvrcelo",
      template: "%s - mvrcelo",
   },
   description: "Control your databases anywhere.",
   icons: {
      icon: "/logo.svg",
      apple: "/logo.svg",
   },
} satisfies Metadata;

export const viewport: Viewport = {
   userScalable: false,
} satisfies Viewport;

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <body
            className={`bg-background flex max-h-lvh min-h-svh flex-col overflow-x-hidden ${geistSans.variable} ${plusJakartaSans.variable}`}
         >
            <Provider>
               <ThemeProvider attribute="class" enableColorScheme enableSystem disableTransitionOnChange>
                  <ReactQueryProvider>
                     <NuqsAdapter>{children}</NuqsAdapter>
                     <Toaster />
                  </ReactQueryProvider>
               </ThemeProvider>
            </Provider>
         </body>
      </html>
   );
}
