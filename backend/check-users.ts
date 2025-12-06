import dotenv from 'dotenv';
dotenv.config();

import { prisma } from './src/config/database';

async function main() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });

  console.log('All users:');
  console.log(JSON.stringify(users, null, 2));

  await prisma.$disconnect();
}

main().catch(console.error);
