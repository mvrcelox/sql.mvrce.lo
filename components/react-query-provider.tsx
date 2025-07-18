"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { toast } from "sonner";

const queryClient = new QueryClient({
   defaultOptions: {
      mutations: {
         onError: (error) => {
            toast.error(error.message);
         },
      },
   },
});

export const ReactQueryProvider = ({ children }: React.PropsWithChildren) => {
   return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
