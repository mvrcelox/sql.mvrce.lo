import { Footer } from "@/app/components/footer";
import { Sidebar } from "@/app/components/sidebar";
import Provider from "../provider";

export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <Provider>
         <div className="flex grow self-stretch overflow-hidden">
            <Sidebar />
            <div className="flex grow flex-col self-stretch overflow-hidden bg-gray-100">
               {children}
               <Footer />
            </div>

            {/* <NetworkStatus /> */}
         </div>
      </Provider>
   );
}
