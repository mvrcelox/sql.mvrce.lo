export default function Page() {
   return (
      <main className="flex grow flex-col items-center justify-center gap-8 pt-12 md:pt-16">
         <div className="w-full max-w-2xl grow space-y-2 p-4 text-sm text-gray-700 lg:text-base">
            <p>
               Hello, my name is <span className="text-foreground">Marcelo</span>.
            </p>
            {/* <p>
               You can access my{" "}
               <Link
                  href="https://github.com/mvrcelitos"
                  target="_blank"
                  className="rounded-sm bg-gray-100 px-1 hover:bg-gray-200"
               >
                  github
               </Link>
               .
            </p> */}
         </div>
      </main>
   );
}
