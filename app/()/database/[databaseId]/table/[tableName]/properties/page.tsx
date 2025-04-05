import { notFound } from "next/navigation";

// import { DataTableToolbar } from "@/app/components/data-table-toolbar";
import { TableWrapper } from "@/app/components/ui/table";
import { findDatabase } from "@/models/databases";
import { createPSQLDatabase } from "@/lib/database-factory";
import { DataTable } from "@/app/components/data-table";
import { Metadata } from "next";
import { loadSearchParams } from "../search-params";

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
   const columns = {
      Column: "c.column_name",
      Position: "c.ordinal_position",
      Type: "c.udt_name",
      Nullable: "c.is_nullable",
      Default: "c.column_default",
      Comment: "pgd.description",
   };
   const sort =
      searchParams?.sort && searchParams?.sort in columns
         ? columns[searchParams?.sort as keyof typeof columns]
         : "c.ordinal_position";

   try {
      const data = await client.query(
         `SELECT c.column_name as "Column", c.ordinal_position as "Position", case when c.character_maximum_length > 0 then concat(c.udt_name,'(',c.character_maximum_length,')') else c.udt_name end as "Type", c.is_nullable as "Nullable", c.column_default as "Default", replace(pgd.description,'
','\n') as "Comment"
         FROM pg_catalog.pg_statio_all_tables as st
         INNER JOIN pg_catalog.pg_description pgd on pgd.objoid = st.relid
         RIGHT JOIN information_schema.columns c on pgd.objsubid = c.ordinal_position and c.table_schema = st.schemaname and c.table_name = st.relname
         WHERE c.table_schema = 'public' and c.table_name = $1
         ORDER BY ${sort} ${ordenation} LIMIT $2`,
         [params.tableName, limit],
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
            <DataTable count={data?.rows?.length || 0} fields={fields} rows={data?.rows ?? []} editable={false} />
         </TableWrapper>
      </main>
   );
}
