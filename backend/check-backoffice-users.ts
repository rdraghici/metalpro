import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkBackofficeUsers() {
  try {
    console.log('🔍 Checking backoffice users...\n');

    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['BACKOFFICE', 'ADMIN']
        }
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    if (users.length === 0) {
      console.log('❌ No backoffice users found in database\n');
      console.log('We need to create a test user: operator@metalpro.ro');
    } else {
      console.log(`✅ Found ${users.length} backoffice user(s):\n`);
      users.forEach(user => {
        console.log(`  Email: ${user.email}`);
        console.log(`  Name: ${user.name}`);
        console.log(`  Role: ${user.role}`);
        console.log(`  Created: ${user.createdAt}`);
        console.log('');
      });
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkBackofficeUsers();
