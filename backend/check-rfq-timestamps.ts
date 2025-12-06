import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://metalpro_dev:metalpro_dev_password_2024@localhost:5432/metalpro_dev'
    }
  }
});

async function main() {
  const rfq = await prisma.rFQ.findUnique({
    where: { id: 'c96a9e9a-3c62-460a-a26a-9b1d6f6fb79d' },
    select: {
      id: true,
      status: true,
      submittedAt: true,
      acknowledgedAt: true,
      inProgressAt: true,
      quotedAt: true,
      completedAt: true,
      cancelledAt: true,
    }
  });

  console.log('Current RFQ State:');
  console.log(JSON.stringify(rfq, null, 2));

  await prisma.$disconnect();
}

main();
