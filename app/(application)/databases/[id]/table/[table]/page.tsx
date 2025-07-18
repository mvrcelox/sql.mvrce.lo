import { notFound } from "next/navigation";

// import { DataTableToolbar } from "@/components/data-table-toolbar";
import { createPSQLDatabase } from "@/lib/database-factory";
import { DataTable } from "@/components/data-table";
import { Metadata } from "next";
import { loadSearchParams } from "./search-params";
import to from "@/helpers/to";
import { findDatabase } from "@/controllers/database.controller";

interface Params {
   id: string;
   table: string;
}

interface SearchParams {
   hide?: string;
   limit?: number;
   sort?: string;
   order?: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
   const awaitedParams = await params;
   return { title: awaitedParams.table };
}

export const maxDuration = 10;

const getData = async (params: Params, searchParams: SearchParams) => {
   "use server";

   if (isNaN(Number(params?.id))) throw new Error("Invalid database");

   const { data, error } = await to(findDatabase(params?.id));
   if (error) throw error;

   if (!data || data) notFound();

   const client = createPSQLDatabase(data);

   try {
      await client?.connect();
   } catch (error) {
      console.error("Can't connect to database");
      console.error(error);
      return;
   }

   if (client.status === "disconnected") {
      console.error("Database is disconnected, cant query");
      return;
   }

   try {
      const data = await client.getTable(params.table, {
         sort: searchParams?.sort ?? 1,
         order: searchParams?.order?.toLowerCase() === "desc" ? "DESC" : "ASC",
         limit: Number(searchParams?.limit) || 200,
      });

      if (!data) return;

      return data;
   } catch (error) {
      if ((error as { code?: string })?.code === "42P01") {
         notFound();
      }
   }
};

export default async function Page({
   params,
   searchParams,
}: {
   params: Promise<Params>;
   searchParams: Promise<Record<string, string>>;
}) {
   const awaitedParams = await params;
   const awaitedSearchParams = await loadSearchParams(searchParams);

   const data = await getData(awaitedParams, awaitedSearchParams);

   const count = data?.count || 0;
   const fields = data?.fields ?? [];
   const rows = data?.rows ?? [];

   return (
      <main className="flex flex-initial grow flex-col self-stretch overflow-hidden bg-gray-100">
         <DataTable count={count} fields={fields} rows={rows} />
      </main>
   );
}
