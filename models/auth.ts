import "server-only";

import { createServerActionProcedure } from "zsa";
import { UnauthorizedException } from "@/infra/errors";
import { auth } from "@/auth";
import { Session } from "@/global";

export const cookiesAuthKey = "AUTH";

export async function authenticate(): Promise<Session | null> {
   const session: Session = (await auth()) as Session;
   if (!session?.user) return null;
   return session as { user: NonNullable<(typeof session)["user"]> };
}

export const authedProcedure = createServerActionProcedure()
   .handler(async () => {
      const session: Session = (await auth()) as Session;
      if (!session?.user) throw new UnauthorizedException();
      return session as { user: NonNullable<(typeof session)["user"]> };
   })
   .createServerAction();

// interface UnauthorizedProps {
//    toast?: { intent?: "default" | "success" | "error"; message: string };
//    redirect?: string;
// }

// function unauthorized(props?: UnauthorizedProps): never {
//    if (isObjectEmpty(props)) redirect("/auth/sign-in");
//    redirect(
//       `/auth/sign-in?${Object.entries(props ?? {})
//          .map((x) => x.join("="))
//          .join("&")}`,
//    );
// }

const Authentication = { authedProcedure };
export default Authentication;
