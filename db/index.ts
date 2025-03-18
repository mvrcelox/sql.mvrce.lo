import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/node-postgres";

dotenv.config();

// if (process.env.POSTGRES_HOST !== "localhost") {
//    console.error("This seed is only intended to be run in development mode");
//    process.exit(1);
// }

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
