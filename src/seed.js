const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

async function loadUsers() {
  const data = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  for (const user of data) {
    const hashedPassword = await hashPassword(user.password);

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
        password: hashedPassword,
        roles: user.roles,
        prescriptions: { create: user.prescriptions },
        patients: { create: user.patients },
        drugs: { create: user.drugs },
        medical_records: { create: user.medical_records },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }
}

loadUsers()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log('Seeded users');
    await prisma.$disconnect();
  });
