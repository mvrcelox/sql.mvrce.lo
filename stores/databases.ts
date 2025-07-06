"use client";

import { connectDatabase } from "@/controllers/database.controller";
import { toast } from "sonner";
import { create } from "zustand";

interface Database {
   id: string;
   tables?: { table_name: string }[];
   views?: { table_name: string }[];
   indexes?: { indexname: string }[];
   sequences?: { sequencename: string }[];
   status: "connecting" | "connected" | "error";
}

interface DatabasesStore {
   connecteds: Database[];
   find: (id: string) => Database | null;
   connect: (id: string) => unknown;
   disconnect: (id: string) => void;
   getCurrent: () => Database | null;
}

export const useDatabasesStore = create<DatabasesStore>((set, get) => ({
   connecteds: [],
   find: (id) => {
      const connecteds = get().connecteds;

      const index = connecteds.findIndex((x) => x.id === id);
      if (index === -1) return null;

      return connecteds[index];
   },
   connect: async (uuid) => {
      const exists = get().connecteds.find((x) => x.id === uuid);
      if (exists) return;

      set((state) => ({
         ...state,
         connecteds: [...state.connecteds, { id: uuid, status: "connecting" }],
      }));
      const response = await connectDatabase(uuid);

      if (!response.success) {
         set((state) => {
            const index = state.connecteds?.findIndex((x) => x.id === uuid);
            if (!index) return state;

            state.connecteds[index].status = "error";

            return { ...state, connecteds: [...state.connecteds] };
         });

         toast.error(response.error?.message, { description: response.error.action });
         return;
      }

      set((state) => {
         const index = state.connecteds?.findIndex((x) => x.id === uuid);
         if (index === -1) return state;

         const connecteds = state.connecteds;
         connecteds[index] = { ...response.data, id: uuid, status: "connected" };

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
         return get().find(splitted[2] || "");
      }
      return null;
   },
}));
