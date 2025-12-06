import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function updateOperatorPassword() {
  try {
    console.log('🔧 Updating operator password...\n');

    // Hash the password
    const hashedPassword = await bcrypt.hash('operator123', 10);

    // Update the operator user
    const updatedUser = await prisma.user.update({
      where: { email: 'operator@metalpro.ro' },
      data: { password: hashedPassword },
      select: {
        email: true,
        name: true,
        role: true,
      }
    });

    console.log('✅ Password updated successfully!');
    console.log(`   User: ${updatedUser.email}`);
    console.log(`   Name: ${updatedUser.name}`);
    console.log(`   Role: ${updatedUser.role}`);
    console.log(`   New password: operator123\n`);

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

updateOperatorPassword();
