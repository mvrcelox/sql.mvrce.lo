"use client";

import Button from "@/components/ui/button";
import {
   Dialog,
   DialogBody,
   DialogClose,
   DialogContent,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import databaseSchema from "@/dtos/databases.dto";
import credentialsSchema from "@/dtos/credentials";
import { useMutation } from "@tanstack/react-query";
import { ClipboardPaste, Loader2 } from "lucide-react";
import { Controller, FieldErrors, FormProvider, useForm, useFormContext, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { createDatabase, testDatabaseConnection } from "@/controllers/database.controller";

type Props = React.PropsWithChildren & {
   open?: boolean;
   setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
   onSuccess?: () => unknown;
};

type CreateDatabaseSchema = z.infer<typeof createDatabaseSchema>;
const createDatabaseSchema = databaseSchema.omit({ id: true, owner_id: true });

const defaultValues: Partial<CreateDatabaseSchema> = {
   // schema: "public",
};

export default function AddDatabaseDialog({ children, onSuccess }: Props) {
   const { data: session } = useSession();
   const [open, setOpen] = useState<boolean>(false);

   const form = useForm<CreateDatabaseSchema>({
      defaultValues,
      resolver: zodResolver(createDatabaseSchema),
   });
   const {
      control,
      clearErrors,
      formState: { errors },
      getValues,
      handleSubmit,
      register,
      setValue,
      trigger,
      reset,
   } = form;

   const { mutate: test, isPending: isTesting } = useMutation({
      mutationKey: ["test-database-connection"],
      mutationFn: async (values: CreateDatabaseSchema) => {
         clearErrors();

         const validation = await createDatabaseSchema.safeParseAsync(values);
         if (!validation.success && validation.error) {
            for (const issue of validation.error.issues) {
               if (issue.path.length <= 0) continue;
               if (issue.path?.[0] == "name") continue;
               trigger(issue.path.join(".") as keyof CreateDatabaseSchema);
            }
         }

         const response = await testDatabaseConnection(values);
         if (!response.success) {
            console.error(response.error);
            toast.error(response.error.message, { description: response.error?.action });
            return;
         }
         toast.success("Sucessfully connected.");
      },
   });

   async function onValid(data: CreateDatabaseSchema) {
      const response = await createDatabase(data);
      if (!response.success) {
         toast.error(response.error.message, { description: response.error?.action });
         return;
      }

      if (onSuccess) await onSuccess();
      setOpen(false);
      reset();
   }

   async function onError(error: FieldErrors<CreateDatabaseSchema>) {
      if (!session?.user) {
         toast.warning("You need to sign in first!");
         return;
      }
      const entries = Object.entries(error);
      if (entries.length <= 0) return;
      toast.error(`Error on field "${entries[0][0]}": ${entries[0][1].message}.`);
   }

   async function handlePaste() {
      const clipboard = await navigator.clipboard.readText();
      if (!clipboard) {
         toast.error("Clipboard is empty");
         return;
      }

      const matched = clipboard.match(
         // @ts-expect-error typescript doesn't understand the regex
         /(?<protocol>\w+(?=:\/{2}))?(?::\/{2})?(?<username>\w+?(?=:[^@\/]))\:(?<password>[^@]+?(?=@))(?:@)(?<host>.*?(?=\:|\/))(?<port>:\d+(?=\/))?(?:\/)(?<database>[^?]+(?=$|(\?.*)?))/,
      );
      if (!matched) {
         toast.error("URL doesn't match the expected pattern.");
         return;
      }

      if (matched?.groups?.protocol && !["postgresql", "postgres"].includes(matched?.groups?.protocol)) {
         toast.error("Not supported database protocol.");
         return;
      }

      const res: Record<string, unknown> = matched.groups ?? {};
      res["port"] = matched?.groups?.port?.replace(/[^0-9]/g, "") || "5432";
      res["ssl"] = clipboard?.includes("sslmode=require");

      const safe = await credentialsSchema.safeParseAsync(res);
      if (!safe.success) {
         const issue = safe.error.issues[0];
         toast.error(
            "Invalid database credentials" +
               (process.env.NODE_ENV === "development" ? ` - ${issue.path.join(".")}: ${issue.message}` : ""),
         );
         return;
      }

      const entries = Object.entries(safe.data) as Array<
         [keyof typeof safe.data, (typeof safe.data)[keyof typeof safe.data]]
      >;
      entries.forEach(([key, value]) => {
         setValue(key, value);
      });
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>{children}</DialogTrigger>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>Add database</DialogTitle>
            </DialogHeader>
            <DialogBody>
               <FormProvider {...form}>
                  <form className="flex flex-col gap-2 self-stretch" onSubmit={handleSubmit(onValid, onError)}>
                     {/* <div className="flex items-center gap-1 rounded-md bg-gray-200 p-1">
                        <span
                           aria-selected={true}
                           className="aria-selected:text-foreground aria-selected:bg-background inline-flex h-8 flex-1 items-center justify-center rounded-sm px-3 text-center text-sm text-gray-500 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700"
                        >
                           Credentials
                        </span>
                        <span
                           aria-selected={false}
                           className="aria-selected:text-foreground aria-selected:bg-background inline-flex h-8 flex-1 items-center justify-center rounded-sm px-3 text-center text-sm text-gray-500 hover:cursor-pointer hover:bg-gray-100 hover:text-gray-700"
                        >
                           Advanced settings
                        </span>
                     </div> */}

                     {/* <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-600">Credentials</span>
                        <div className="flex items-center gap-2">
                        </div>
                     </div> */}

                     <div className="grid grid-cols-1 items-center gap-2 sm:grid-cols-4">
                        <div className="grid grid-cols-1 gap-1 sm:col-span-3">
                           <Label required>Host</Label>
                           <div className="relative">
                              <Input
                                 intent="opaque2"
                                 aria-invalid={!!errors?.host}
                                 {...register("host")}
                                 onKeyDown={(e) => {
                                    if (e.ctrlKey && e.key.toLowerCase() === "v" && !e.altKey) {
                                       e.preventDefault();
                                       handlePaste();
                                    }
                                 }}
                                 className={
                                    errors?.host
                                       ? "!border-red-500 !outline-red-500 dark:!border-red-600 dark:!outline-red-600"
                                       : undefined
                                 }
                              />
                              <TooltipProvider delayDuration={0} disableHoverableContent>
                                 <Tooltip>
                                    <TooltipTrigger asChild>
                                       <Button
                                          intent="outline"
                                          size="icon"
                                          className="absolute top-1/2 right-1 ml-auto size-8 -translate-y-1/2"
                                          onClick={handlePaste}
                                       >
                                          <span className="sr-only">Paste database url</span>
                                          <ClipboardPaste className="size-4 shrink-0" />
                                       </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="flex flex-col">
                                       <span className="text-background">Paste database URL</span>
                                       {/* <span className="text-background text-xs opacity-70">
                                          The database has to been in your clipboard
                                       </span> */}
                                    </TooltipContent>
                                 </Tooltip>
                              </TooltipProvider>
                           </div>
                        </div>

                        <div className="grid grid-cols-1 gap-1">
                           <Label className="font-di text-sm text-gray-700">Port</Label>
                           <Input
                              intent="opaque2"
                              placeholder="5432"
                              aria-invalid={!!errors?.port}
                              {...register("port")}
                              className={
                                 errors?.port
                                    ? "!border-red-500 !outline-red-500 dark:!border-red-600 dark:!outline-red-600"
                                    : undefined
                              }
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 gap-1">
                        <Label required>Database</Label>
                        <Input
                           intent="opaque2"
                           aria-invalid={!!errors?.database}
                           {...register("database")}
                           className={
                              errors?.database
                                 ? "!border-red-500 !outline-red-500 dark:!border-red-600 dark:!outline-red-600"
                                 : undefined
                           }
                        />
                     </div>

                     <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <div className="grid grid-cols-1 gap-1">
                           <Label required>Username</Label>
                           <Input
                              intent="opaque2"
                              aria-invalid={!!errors?.username}
                              {...register("username")}
                              className={
                                 errors?.username
                                    ? "!border-red-500 !outline-red-500 dark:!border-red-600 dark:!outline-red-600"
                                    : undefined
                              }
                           />
                        </div>

                        <div className="grid grid-cols-1 gap-1">
                           <Label required>Password</Label>
                           <Input
                              intent="opaque2"
                              type="password"
                              aria-invalid={!!errors?.password}
                              {...register("password")}
                              className={
                                 errors?.password
                                    ? "!border-red-500 !outline-red-500 dark:!border-red-600 dark:!outline-red-600"
                                    : undefined
                              }
                           />
                        </div>
                     </div>

                     <Separator className="-mx-4 my-4" />

                     <div className="mb-2 flex flex-row self-stretch">
                        <div className="grid grow grid-cols-1 gap-1 sm:col-span-3">
                           <Label required>Schema</Label>
                           {/* <Input
                              intent="opaque2"
                              placeholder="public"
                              aria-invalid={!!errors?.schema}
                              {...register("schema")}
                              className={
                                 errors?.schema
                                    ? "!border-red-500 !outline-red-500 dark:!border-red-600 dark:!outline-red-600"
                                    : undefined
                              }
                           /> */}
                        </div>
                        <div className="flex items-center gap-3 px-3">
                           <Label className="text-sm" htmlFor="ssl">
                              SSL
                           </Label>

                           <Controller
                              name="ssl"
                              control={control}
                              render={({ field }) => (
                                 <Switch
                                    disabled={field.disabled}
                                    id="ssl"
                                    onBlur={field.onBlur}
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    name={field.name}
                                    ref={field.ref}
                                 />
                              )}
                           />
                        </div>
                     </div>

                     <div className="grid grid-cols-1 gap-1">
                        <Label required>Name</Label>
                        <NameInput />
                     </div>

                     <div className="-m-4 mt-2 border-t">
                        <DialogFooter className="flex-row justify-between">
                           <DialogClose asChild>
                              <Button disabled={isTesting} intent="ghost" className="max-xs:hidden">
                                 Cancel
                              </Button>
                           </DialogClose>

                           <Button
                              disabled={isTesting}
                              intent="outline"
                              className="xs:ml-auto relative overflow-hidden"
                              onClick={() => {
                                 if (!navigator.onLine) {
                                    toast.error("You are offline.");
                                    return;
                                 }
                                 test(getValues());
                              }}
                           >
                              Test connection
                              {isTesting ? (
                                 <span className="absolute inset-0 grid place-items-center bg-[inherit]">
                                    <Loader2 className="size-4 shrink-0 animate-spin" />
                                 </span>
                              ) : null}
                           </Button>
                           <Button
                              disabled={isTesting}
                              type={"submit"}
                              intent="primary"
                              className={cn(
                                 "relative disabled:isolate disabled:cursor-not-allowed disabled:opacity-100",
                                 !session?.user ? "cursor-not-allowed opacity-70 select-none" : undefined,
                              )}
                           >
                              Submit
                              {false && (
                                 <span className="absolute inset-0 grid size-full place-items-center rounded-[inherit] bg-inherit">
                                    <Loader2 className="size-4 shrink-0 animate-spin" />
                                 </span>
                              )}
                           </Button>
                        </DialogFooter>
                     </div>
                  </form>
               </FormProvider>
            </DialogBody>
         </DialogContent>
      </Dialog>
   );
}

function NameInput() {
   const {
      control,
      formState: { errors },
      register,
   } = useFormContext<CreateDatabaseSchema>();

   const database = useWatch({ control, name: "database", exact: true });

   return (
      <Input
         intent="opaque2"
         aria-invalid={!!errors?.name}
         placeholder={database ?? "My favorite database"}
         {...register("name")}
         className={
            errors?.name ? "!border-red-500 !outline-red-500 dark:!border-red-600 dark:!outline-red-600" : undefined
         }
      />
   );
}
