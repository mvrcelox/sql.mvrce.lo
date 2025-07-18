import ClientOnly from "@/components/client-only";
import ScriptsProvider from "@/components/scripts";
import Sidebar from "@/components/sidebars/application-sidebar";

export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <ScriptsProvider>
         <div className="flex grow flex-row self-stretch">
            <ClientOnly>
               <Sidebar />
            </ClientOnly>
            {children}
         </div>
      </ScriptsProvider>
   );
}
