import DataTableToolbar from "@/components/data-table-toolbar";
import TableHeader from "../header";

export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <div className="relative m-1.5 flex grow flex-col justify-between self-stretch max-md:mt-0 md:ml-0">
         <TableHeader />
         <div className="bg-background ring-border absolute top-10.5 bottom-10.5 flex w-full flex-[1_1_0] flex-col overflow-hidden rounded-lg ring-1">
            {children}
         </div>
         <DataTableToolbar />
      </div>
   );
}
