import { Sidebar } from "./client";

export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <div className="flex grow self-stretch overflow-hidden">
         <Sidebar />
         <div className="flex grow flex-col self-stretch overflow-hidden">
            {children}
            {/* <Header /> */}
         </div>

         {/* <NetworkStatus /> */}
      </div>
   );
}
