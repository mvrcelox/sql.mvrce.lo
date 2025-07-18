import SignInForm from "./sign-in-form";

import GithubSignIn from "../github-sign-in";
import GitlabSignIn from "../gitlab-sign-in";
import { H1 } from "@/components/ui/texts";
import GoogleSignIn from "../google-sign-in";

export default function Page() {
   return (
      <div className="flex w-full max-w-md flex-col gap-4 self-center">
         <div>
            <H1>Already have an account?</H1>
            <p className="text-sm text-gray-600 lg:text-base">Let access your databases and catch up on/with.</p>
         </div>

         <SignInForm />

         <div className="xs:flex-row relative flex grow flex-col gap-2">
            <GoogleSignIn />
            <GithubSignIn />
            <GitlabSignIn />
         </div>
      </div>
   );
}
