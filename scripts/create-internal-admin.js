// scripts/create-internal-admin.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@ibfa.local';
  const password = 'IbfaAdmin2025!'; // später ändern

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.internalUser.upsert({
    where: { email },
    update: {
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      email,
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('Admin-User angelegt/aktualisiert:');
  console.log(`  E-Mail:   ${user.email}`);
  console.log(`  Passwort: ${password}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });