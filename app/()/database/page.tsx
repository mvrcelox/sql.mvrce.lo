import BadgeLogo from "@/app/components/badge-logo";

export default async function Page() {
   return (
      <div className="flex grow flex-col items-center justify-center gap-2 self-stretch">
         <BadgeLogo />
         <section className="flex flex-col">
            <h1 className="text-foreground mb-2 text-center text-2xl font-semibold md:mb-4 md:text-3xl">
               You are on the path!
            </h1>
            <p className="text-center text-sm text-gray-700 md:text-base">Select a database to get started.</p>
            {/* <p className="text-center text-sm text-gray-700 md:text-base">Please check back later.</p> */}
         </section>
      </div>
   );
}
