"use client";

import { connectDatabase } from "@/models/databases";
import { toast } from "sonner";
import { create } from "zustand";

interface Database {
   id: number;
   name: string;
   description: string | null;
   tables?: { table_name: string }[];
   views?: { table_name: string }[];
   indexes?: { indexname: string }[];
   sequences?: { sequencename: string }[];
   status: "connecting" | "connected" | "error";
}

interface DatabasesStore {
   connecteds: Database[];
   find: (databaseId: number) => Database | null;
   connect: (database: { id: number; name: string; description: string | null }) => unknown;
   disconnect: (databaseId: number) => void;
   getCurrent: () => Database | null;
}

export const useDatabasesStore = create<DatabasesStore>((set, get) => ({
   connecteds: [],
   find: (databaseId) => {
      const connecteds = get().connecteds;
      const index = connecteds.findIndex((x) => x.id === databaseId);
      if (index === -1) return null;

      return connecteds[index];
   },
   connect: async (database) => {
      const exists = get().connecteds.find((x) => x.id === database.id);
      if (exists) return;

      set((state) => ({
         ...state,
         connecteds: [...state.connecteds, { ...database, status: "connecting" }],
      }));
      const [res, error] = await connectDatabase(database.id);

      if (error) {
         set((state) => {
            const find = state.connecteds?.find((x) => x.id === database.id);
            if (!find) return state;

            find.status = "error";

            return { ...state, connecteds: [...state.connecteds] };
         });

         toast.error(error?.message);
         return;
      }

      set((state) => {
         const index = state.connecteds?.findIndex((x) => x.id === database.id);
         if (index === -1) return state;

         const connecteds = state.connecteds;
         connecteds[index] = { ...res, description: res?.description ?? "", status: "connected" };

         return { ...state, connecteds };
      });

      return;
   },
   disconnect: (databaseId) => {
      set((state) => {
         const connecteds = state.connecteds?.filter((x) => x.id !== databaseId);
         return { ...state, connecteds };
      });
   },
   getCurrent: () => {
      const pathname = window.location.pathname;
      const splitted = pathname.split("/");
      if (splitted[1] === "database" && splitted[2] === "table") {
         return get().find(Number(splitted[2]) || 0);
      }
      return null;
   },
}));
