import { eq } from "drizzle-orm";
import db from "./index";
import { rolesTable } from "./schema";

async function seed() {
   const roles = await db.select().from(rolesTable).where(eq(rolesTable.id, 1));
   if (!roles?.length) await db.insert(rolesTable).values([{ id: 1 }]);

   console.log("🌱 Database seeded.");
   process.exit(0);
}

seed().catch(() => {
   console.error("Error seeding the database.");
   process.exit(1);
});
