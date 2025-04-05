import ScriptsProvider from "@/app/components/scripts";
import { Sidebar } from "./client";

export const maxDuration = 5;

export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <div className="flex grow self-stretch overflow-hidden">
         <ScriptsProvider>
            <Sidebar />
            {children}
         </ScriptsProvider>
      </div>
   );
}
