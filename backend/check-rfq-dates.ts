import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const rfq = await prisma.rFQ.findUnique({
      where: { id: '09845810-9112-4550-852e-98f9df72a4ef' },
      select: {
        id: true,
        referenceNumber: true,
        status: true,
        companyName: true,
        submittedAt: true,
        createdAt: true,
        updatedAt: true,
        acknowledgedAt: true,
        quotedAt: true,
      }
    });

    if (rfq) {
      console.log('RFQ Found:');
      console.log(JSON.stringify(rfq, null, 2));
      console.log('\nsubmittedAt value:', rfq.submittedAt);
      console.log('submittedAt type:', typeof rfq.submittedAt);
      console.log('submittedAt instanceof Date:', rfq.submittedAt instanceof Date);
    } else {
      console.log('RFQ not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
