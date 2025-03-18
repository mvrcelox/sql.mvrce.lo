import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { defineConfig } from "drizzle-kit";

expand(
   config({
      path: ".env.development",
   }),
);

export default defineConfig({
   out: "./drizzle",
   schema: "./db/schema.ts",
   dialect: "postgresql",
   dbCredentials: {
      url: process.env.DATABASE_URL!,
   },
});
