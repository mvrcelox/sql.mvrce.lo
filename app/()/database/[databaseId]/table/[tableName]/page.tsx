import { notFound } from "next/navigation";

// import { DataTableToolbar } from "@/app/components/data-table-toolbar";
import { TableWrapper } from "@/app/components/ui/table";
import { findDatabase } from "@/models/databases";
import { createPSQLDatabase } from "@/lib/database-factory";
import { DataTable } from "@/app/components/data-table";
import { Metadata } from "next";
import { loadSearchParams } from "./search-params";
import DataTableToolbar from "@/app/components/data-table-toolbar";

interface Params {
   databaseId: string;
   tableName: string;
}

interface SearchParams {
   hide?: string;
   limit?: number;
   sort?: string;
   order?: string;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
   const awaitedParams = await params;
   return {
      title: awaitedParams.tableName,
   };
}

export const maxDuration = 10;

const getData = async (params: Params, searchParams: SearchParams) => {
   "use server";

   if (isNaN(Number(params?.databaseId))) throw new Error("Invalid database");

   const databaseId = parseInt(params?.databaseId);
   const [found, err] = await findDatabase(databaseId);
   if (err) throw err;
   if (!found) notFound();

   const client = createPSQLDatabase(found);

   try {
      await client?.connect();
   } catch (error) {
      console.error(error);
      return;
   }

   if (client.status === "disconnected") {
      console.error("is disconnected, cant query");
      return;
   }

   const ordenation = searchParams?.order?.toLowerCase() === "desc" ? "DESC" : "ASC";
   const limit = searchParams?.limit ?? 200;
   const sort = searchParams?.sort ?? "id";

   try {
      const data = await client.query(
         `SELECT * FROM ${params.tableName} as t ORDER BY ${sort} ${ordenation} LIMIT ${limit}`,
      );
      if (!data) return;
      // const hiddenColumns: string[] = searchParams?.hide?.split(",") ?? [];
      // data.fields = data.fields.filter((field) => !hiddenColumns.includes(field?.name as string));
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
   const fields = data?.fields && typeof data?.fields === "object" ? JSON.parse(JSON.stringify(data?.fields)) : [];

   return (
      <main className="flex flex-initial grow flex-col self-stretch overflow-hidden bg-gray-100">
         <TableWrapper>
            <DataTable fields={fields} rows={data?.rows ?? []} />
         </TableWrapper>
         <DataTableToolbar />
      </main>
   );
}
