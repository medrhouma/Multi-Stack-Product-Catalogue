import "dotenv/config";
import { hash } from "argon2";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.ADMIN_PASSWORD ?? "password123";

  const user = await prisma.user.upsert({
    where: { email },
    update: {},                                  // si le compte existe, on ne touche à rien
    create: { email, passwordHash: await hash(password) },
  });
  console.log(`User ready: ${user.email}`);
}

main().finally(() => prisma.$disconnect());