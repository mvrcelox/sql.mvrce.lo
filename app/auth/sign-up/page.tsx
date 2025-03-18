import { Separator } from "@/app/components/ui/separator";
import SignUpForm from "./sign-up-form";
import Link from "next/link";

export default function Page() {
   return (
      <>
         <main className="bg-background flex w-full max-w-md flex-col gap-2 overflow-hidden rounded-lg border p-4 shadow-lg">
            <div>
               <h1 className="text-lg font-semibold">Hello, welcome!</h1>
               <p className="truncate text-sm text-gray-500">
                  Are you ready to test databases online?{" "}
                  <span className="max-xs:hidden">You won&apos;t regret it.</span>
               </p>
            </div>
            <Separator className="-mx-4 my-2" />
            <SignUpForm />

            <Separator className="-mx-4 my-2" />
            <Link
               href="/auth/sign-in"
               className="group -m-4 flex justify-center bg-gray-100 p-4 transition-colors hover:bg-gray-200"
            >
               <span className="group-hover:text-foreground text-sm text-gray-600 transition-colors">
                  Already have an account? Click here.
               </span>
            </Link>
         </main>
      </>
   );
}
