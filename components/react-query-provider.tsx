"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export const ReactQueryProvider = ({ children }: React.PropsWithChildren) => {
   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
