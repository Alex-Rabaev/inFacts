import path from "node:path";
import { config as loadEnv } from "dotenv";
import { defineConfig } from "@prisma/config";

// The monorepo keeps a single .env at the repo root (AD-12).
loadEnv({ path: path.resolve(__dirname, "../../.env") });

const url = process.env.DATABASE_URL;

export default defineConfig({
  schema: "prisma/schema.prisma",
  // Optional so schema-only commands (e.g. `prisma generate`) work without env.
  ...(url ? { datasource: { url } } : {}),
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
});
