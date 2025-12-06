import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createOperator() {
  const email = 'operator@metalpro.ro';
  const password = 'operator123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const operator = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      role: 'BACKOFFICE',
    },
    create: {
      email,
      passwordHash: hashedPassword,
      name: 'Back Office Operator',
      role: 'BACKOFFICE',
      phone: '+40123456789',
      emailVerified: true,
    },
  });

  console.log('✅ Operator account created:');
  console.log(`   Email: ${operator.email}`);
  console.log(`   Password: operator123`);
  console.log(`   Role: ${operator.role}`);
}

createOperator()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Error:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
