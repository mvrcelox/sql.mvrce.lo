"use client";

import { SessionProvider } from "next-auth/react";

export default function Provider({ children }: React.PropsWithChildren) {
   return <SessionProvider>{children}</SessionProvider>;
}
