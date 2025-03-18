import Button from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { auth } from "@/auth";

export default async function Page() {
   const session = await auth();

   return (
      <main className="flex grow flex-col items-center justify-center gap-8 self-stretch">
         <section className="h-fit w-full max-w-3xl overflow-hidden rounded-lg border">
            <div className="bg-background flex flex-row items-center justify-between gap-16 p-6">
               <div className="flex flex-col">
                  <div className="text-foreground text-xl font-semibold">Avatar</div>
                  <p className="text-sm text-gray-700">This your avatar.</p>
                  <p className="text-sm text-gray-700">You can change them by clicking.</p>
               </div>
               <span
                  className="block size-20 rounded-full bg-contain"
                  style={
                     session?.user?.image
                        ? { backgroundImage: `url(${session?.user?.image})` }
                        : { background: "var(--gray-200)" }
                  }
               />
            </div>
            <div className="flex min-h-[calc(3.5rem+1px)] items-center justify-between border-t bg-gray-100 px-6 py-3">
               <p className="text-sm text-gray-600">An avatar is optional but strongly recommended.</p>
            </div>
         </section>

         <section className="h-fit w-full max-w-3xl overflow-hidden rounded-lg border">
            <div className="bg-background flex flex-col p-6">
               <div className="text-foreground text-xl font-semibold">Username</div>
               <p className="text-sm text-gray-700">
                  Enter a username that aren&apos;t in use and you are comfortable with.
               </p>
               <Input defaultValue={session?.user?.name ?? ""} className="mt-2 max-w-sm" />
            </div>
            <div className="flex min-h-[calc(3.5rem+1px)] items-center justify-between border-t bg-gray-100 px-6 py-3">
               <span className="text-sm text-gray-600">Use 64 characters at maximum.</span>
               <Button disabled intent="default" size="sm">
                  Save
               </Button>
            </div>
         </section>

         <section className="h-fit w-full max-w-3xl overflow-hidden rounded-lg border">
            <div className="bg-background flex flex-col p-6">
               <div className="text-foreground text-xl font-semibold">Email</div>
               <p className="text-sm text-gray-700">
                  Enter the email that you wanna use to log in and receive notifications.
               </p>
               <Input defaultValue={session?.user?.email ?? ""} className="mt-2 max-w-sm" />
            </div>
            <div className="flex min-h-[calc(3.5rem+1px)] items-center justify-between border-t bg-gray-100 px-6 py-3">
               <span className="text-sm text-gray-600">Use 64 characters at maximum.</span>
               <Button disabled intent="default" size="sm">
                  Save
               </Button>
            </div>
         </section>

         <section className="h-fit w-full max-w-3xl overflow-hidden rounded-lg border">
            <div className="bg-background flex flex-col p-6">
               <div className="text-foreground text-xl font-semibold">Shares</div>
               <p className="text-sm text-gray-700">Your databases that you you shared.</p>
            </div>
            <div className="flex min-h-[calc(3.5rem+1px)] items-center justify-between border-t bg-gray-100 px-6 py-3">
               <span className="text-sm text-gray-600">Use 64 characters at maximum.</span>
               <Button disabled intent="default" size="sm">
                  Save
               </Button>
            </div>
         </section>

         {/* <section className="h-fit w-full max-w-3xl overflow-hidden rounded-lg border border-rose-300 dark:border-red-900">
            <div className="bg-background flex flex-col p-6">
               <div className="text-foreground text-xl font-semibold">Delete account</div>
               <p className="text-sm text-gray-700">
                  Once you delete your account, there is no going back. All your data will be permanently deleted.
               </p>
            </div>
            <div className="flex min-h-[calc(3.5rem+1px)] items-center justify-end border-t border-rose-300 bg-red-100 px-6 py-3 dark:border-red-900 dark:bg-red-950/50">
               <Button disabled intent="destructive" size="sm">
                  Delete account
               </Button>
            </div>
         </section> */}
      </main>
   );
}
