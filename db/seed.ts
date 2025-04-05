import { eq } from "drizzle-orm";
import db from "./index";
import { rolesTable } from "./schema";

const seed = async () => {
   const roles = await db.select().from(rolesTable).where(eq(rolesTable.id, 1));
   if (roles?.length) {
      console.log("Role already seeded.");
      process.exit(0);
      return;
   }

   await db.insert(rolesTable).values([{ id: 1 }]);
   console.log("Role seeded.");
   process.exit(0);
};

seed();
