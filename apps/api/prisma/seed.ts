import { PrismaPg } from "@prisma/adapter-pg";
import * as argon2 from "argon2";
import { PrismaClient } from "../src/generated/prisma/client";
import { Role } from "../src/generated/prisma/enums";

/**
 * Idempotent demo seed: one admin + a few regular users (Story 1.2, AR-5).
 * Demo password is shared and intentionally public — this is seed data.
 */
const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD ?? "infacts-demo";

interface SeedUser {
  username: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  bio: string;
}

const USERS: SeedUser[] = [
  {
    username: "admin",
    email: "admin@infacts.dev",
    role: Role.admin,
    firstName: "Ada",
    lastName: "Admin",
    bio: "Keeper of the moderation queue.",
  },
  {
    username: "maya",
    email: "maya@infacts.dev",
    role: Role.user,
    firstName: "Maya",
    lastName: "Reyes",
    bio: "I only share what I can source.",
  },
  {
    username: "daniel",
    email: "daniel@infacts.dev",
    role: Role.user,
    firstName: "Daniel",
    lastName: "Kim",
    bio: "Curious about everything, convinced by little.",
  },
  {
    username: "priya",
    email: "priya@infacts.dev",
    role: Role.user,
    firstName: "Priya",
    lastName: "Sharma",
    bio: "Here for the facts, staying for the threads.",
  },
];

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is required to seed the database");
  }
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: url }),
  });

  try {
    const passwordHash = await argon2.hash(DEMO_PASSWORD);
    for (const user of USERS) {
      await prisma.user.upsert({
        where: { username: user.username },
        update: {},
        create: { ...user, passwordHash },
      });
    }
    const count = await prisma.user.count();
    console.log(`Seed complete: ${count} users present (demo password: "${DEMO_PASSWORD}").`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
