import { Separator } from "../components/ui/separator";
import Inputs from "./inputs";
import Selects from "./selects";

export default function Page() {
   return (
      <div className="mx-auto flex w-full max-w-7xl grow flex-col gap-4 p-4 md:gap-8 md:py-8">
         <h1 className="text-foreground text-2xl font-semibold">Typography</h1>
         <Separator />
         <Inputs />
         <Selects />
      </div>
   );
}
