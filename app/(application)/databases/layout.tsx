import ClientOnly from "@/components/client-only";
import DatabasesSidebar from "@/components/sidebars/databases-sidebar";

export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <div className="flex grow flex-row self-stretch">
         <ClientOnly>
            <DatabasesSidebar />
         </ClientOnly>
         {children}
      </div>
   );
}
