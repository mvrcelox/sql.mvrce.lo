import { Separator } from "@/app/components/ui/separator";
import SignInForm from "./sign-in-form";
import Button from "@/app/components/ui/button";
import GoogleIcon from "@/app/components/icons/google-icon";
import Link from "next/link";

import GithubSignIn from "../github-sign-in";
import GitlabSignIn from "../gitlab-sign-in";

export default function Page() {
   return (
      <>
         <main className="bg-background flex w-full max-w-md flex-col gap-2 overflow-hidden rounded-lg border p-4 shadow-lg">
            <div>
               <h1 className="text-lg font-semibold">Where have you been, welcome back!</h1>
               <p className="text-sm text-gray-500">Complete your credentials to sign in.</p>
            </div>
            <Separator className="-mx-4 my-2" />
            <SignInForm />
            <div className="relative -mx-4 mt-4 flex gap-2">
               <Separator className="w-full self-center" />
               <span className="bg-background absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2 text-xs text-gray-500 hover:bg-gray-100">
                  Or sign in with
               </span>
               {/* <Separator className="w-full self-center" /> */}
            </div>
            <div className="xs:flex-row xs:items-center -m-4 -mt-2 flex flex-col gap-2 bg-gray-100 p-4 pt-6">
               <Button intent="outline" className="xs:grow xs:basis-0 relative shrink gap-2">
                  <GoogleIcon className="size-5 shrink-0" />
                  Google
               </Button>
               <GithubSignIn />
               <GitlabSignIn />
            </div>
            <Separator className="-mx-4 my-2" />
            <Link
               href="/auth/sign-up"
               className="group -m-4 flex justify-center bg-gray-100 p-4 transition-colors hover:bg-gray-200"
            >
               <span className="group-hover:text-foreground text-sm text-gray-600 transition-colors">
                  Doesn&apos;t have an account? Create an account.
               </span>
            </Link>
         </main>
      </>
   );
}
