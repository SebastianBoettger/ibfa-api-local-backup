// scripts/create-internal-admin.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

function env(name, fallback) {
  const v = process.env[name];
  return v && String(v).trim() !== '' ? String(v).trim() : fallback;
}

async function main() {
  // ✅ ENV first, fallback to safe defaults
  const email = env('EMAIL', 'admin@ibfa.local');
  const password = env('PASSWORD', 'IbfaAdmin2025!');
  const firstName = env('FIRST_NAME', 'Admin');
  const lastName = env('LAST_NAME', 'User');
  const role = env('ROLE', 'ADMIN'); // must match your Prisma enum values

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.internalUser.upsert({
    where: { email },
    update: {
      passwordHash,
      firstName,
      lastName,
      role,
      isActive: true,
      lastLoginAt: null,
    },
    create: {
      email,
      passwordHash,
      firstName,
      lastName,
      role,
      isActive: true,
      lastLoginAt: null,
    },
  });

  console.log('Admin-User angelegt/aktualisiert:');
  console.log(`  E-Mail:   ${user.email}`);
  console.log(`  Passwort: ${password}`);
  console.log(`  Name:     ${firstName} ${lastName}`);
  console.log(`  Rolle:    ${role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
