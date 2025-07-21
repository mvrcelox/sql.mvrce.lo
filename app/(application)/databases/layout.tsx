import ClientOnly from "@/components/client-only";
import DatabasesSidebar from "@/components/sidebars/databases-sidebar";

export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <div className="flex max-w-full flex-[1_1_0] flex-row">
         <ClientOnly>
            <DatabasesSidebar />
         </ClientOnly>
         {children}
      </div>
   );
}
