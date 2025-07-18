// import { Header } from "@/components/footer";
import { auth } from "@/auth";
import { H1 } from "@/components/ui/texts";
import { Description, GetStarted, Title } from "./components/client";

export default async function Page() {
   const session = await auth();
   return (
      <div className="relative mx-auto flex w-full max-w-3xl grow flex-col items-center justify-center text-center">
         <H1>
            <Title />
         </H1>
         <Description className="text-sm text-gray-600 lg:text-base" />
         <GetStarted session={session} />
      </div>
   );
}
