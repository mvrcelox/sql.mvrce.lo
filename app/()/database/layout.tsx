import ClientOnly from "@/components/client-only";
import ScriptsProvider from "@/components/scripts";
import DatabasesSidebar from "@/components/sidebars/databases-sidebar";

export const maxDuration = 5;

export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <div className="flex grow self-stretch overflow-hidden">
         <ScriptsProvider>
            <ClientOnly>
               <DatabasesSidebar />
            </ClientOnly>
            {children}
         </ScriptsProvider>
      </div>
   );
}
