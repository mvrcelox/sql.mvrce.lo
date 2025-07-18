import { H1 } from "@/components/ui/texts";

export default async function Page() {
   return (
      <div className="flex grow flex-col items-center justify-center self-stretch text-center">
         <H1>You are on the path!</H1>
         <p className="text-sm text-gray-600 lg:text-base">Select a database to get started.</p>
      </div>
   );
}
