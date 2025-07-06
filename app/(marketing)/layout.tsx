import { OpenProvider } from "@/contexts/open-context";
import { Header } from "@/components/header";
import MarketingAside from "./components/marketing-aside";
import MarketingSection from "./components/marketing-section";

export default function Layout({ children }: React.PropsWithChildren) {
   return (
      <OpenProvider>
         <main className="flex grow flex-col">
            <Header />
            <MarketingAside />
            <MarketingSection>{children}</MarketingSection>
         </main>
         <div className="fade-top fixed inset-x-0 top-0 z-[1] h-24 w-full backdrop-blur" />
      </OpenProvider>
   );
}
