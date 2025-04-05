import db from "@/db";
import { lower, userEmailsTable, usersTable } from "@/db/schema";
import tryCatch from "@/helpers/try-catch";
import { eq, or, sql } from "drizzle-orm";

import NextAuth from "next-auth";
import authConfig from "./config/auth.config";
// import jwt from "jsonwebtoken";

export const { auth, handlers, signIn, signOut } = NextAuth({
   ...authConfig,
   // jwt: {
   //    maxAge: 30 * 24 * 60 * 60, // 30 days
   // },
   session: {
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60, // 30 days
   },
   callbacks: {
      // @ts-expect-error jwt method doesn't match the expected
      jwt: async ({ token }) => {
         const { data: users, error } = await tryCatch(
            db
               .select()
               .from(usersTable)
               .leftJoin(userEmailsTable, eq(usersTable.id, userEmailsTable.user_id))
               .where(eq(lower(userEmailsTable.email), token.email)),
         );
         const unique = users?.[0]?.users;
         if (error || !unique) return token;

         await tryCatch(db.update(usersTable).set({ last_login_at: new Date() }).where(eq(usersTable.id, unique.id)));

         return { ...token, sub: unique.id } as const;
      },
      session: async ({ session, token }) => {
         if (session.user) session.user.id = token.sub || "";
         return session;
      },
      signIn: async ({ user }) => {
         const { data: exists, error } = await tryCatch(
            db
               .select()
               .from(userEmailsTable)
               .where(or(eq(lower(userEmailsTable.email), (user.email ?? "").toLowerCase()))),
         );

         if (error) {
            console.error(error);
            return false;
         }

         if (!exists.length) {
            const name = user.name ?? sql`'uuid_generate_v4()'`;

            const email = user.email;
            if (!email) return false;

            try {
               const user = await db
                  .insert(usersTable)
                  .values({
                     name,
                     role_id: 1,
                     status: 1,
                  })
                  .returning();

               if (!user?.length) return false;

               const ok = await db
                  .insert(userEmailsTable)
                  .values({
                     email,
                     user_id: user[0].id,
                     main: true,
                  })
                  .returning();

               if (!ok?.length) return false;
               return true;
            } catch (error) {
               console.error(error);

               return false;
            }
         }

         return true;
      },
   },
   pages: {
      signIn: "/auth/sign-in",
      signOut: "/auth/sign-out",
   },
   secret: process.env.NEXTAUTH_SECRET,
});
