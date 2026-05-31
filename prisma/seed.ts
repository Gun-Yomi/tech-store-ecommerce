import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.DEFAULT_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.DEFAULT_ADMIN_PASSWORD;
  const name = process.env.DEFAULT_ADMIN_NAME?.trim() || "Local Admin";

  if (!email || !password) {
    console.log(
      "Skipping admin seed. Set DEFAULT_ADMIN_EMAIL and DEFAULT_ADMIN_PASSWORD to create a local admin user.",
    );
    return;
  }

  if (password.length < 8) {
    throw new Error("DEFAULT_ADMIN_PASSWORD must be at least 8 characters.");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role: UserRole.ADMIN,
      status: "ACTIVE",
    },
    create: {
      name,
      email,
      passwordHash,
      role: UserRole.ADMIN,
      status: "ACTIVE",
    },
  });

  console.log(`Seeded local admin user: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
