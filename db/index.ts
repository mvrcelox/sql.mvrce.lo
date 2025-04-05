import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import { drizzle } from "drizzle-orm/node-postgres";

expand(dotenv.config({ path: ".env.development" }));

const db = drizzle(process.env.DATABASE_URL!);

// async function main() {
//    const user: typeof usersTable.$inferInsert = {
//       username: "JohnUser",
//       email: "https.braganca@gmail.com",
//       password: "123456",
//       role_id: 1,
//    };

//    db.insert(usersTable).values(user);
// }

export default db;
