import SignUpForm from "./sign-up-form";

import GithubSignIn from "../github-sign-in";
import GitlabSignIn from "../gitlab-sign-in";
import { H1 } from "@/components/ui/texts";
import GoogleSignIn from "../google-sign-in";

export default function Page() {
   return (
      <div className="flex w-full max-w-md flex-col gap-4 self-center">
         <div>
            <H1>Hello and be welcome!</H1>
            <p className="text-sm text-gray-600 lg:text-base">Complete your credentials to create your account.</p>
         </div>

         <SignUpForm />

         <div className="xs:flex-row relative flex grow flex-col gap-2">
            <GoogleSignIn />
            <GithubSignIn />
            <GitlabSignIn />
         </div>
      </div>
   );
}
