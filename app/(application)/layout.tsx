import ClientOnly from "@/components/client-only";
import ScriptsProvider from "@/components/scripts";
import ApplicationSidebar from "@/components/sidebars/application-sidebar";

export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <ScriptsProvider>
         <div className="flex grow flex-col self-stretch bg-gray-200 md:flex-row">
            <ClientOnly>
               <ApplicationSidebar />
            </ClientOnly>
            {children}
         </div>
      </ScriptsProvider>
   );
}
