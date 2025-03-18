import "server-only";

import { createServerActionProcedure } from "zsa";
import { UnauthorizedError } from "@/infra/errors";
import { auth } from "@/auth";
import { Session } from "@/global";

export const cookiesAuthKey = "AUTH";

export const authedProcedure = createServerActionProcedure()
   .handler(async () => {
      const session: Session = (await auth()) as Session;
      if (!session?.user) throw new UnauthorizedError();
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
