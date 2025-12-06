import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const rfq = await prisma.rFQ.findUnique({
      where: { id: '09845810-9112-4550-852e-98f9df72a4ef' },
      include: {
        items: true,
        user: true
      }
    });

    if (rfq) {
      console.log('\n=== RFQ Data ===');
      console.log('ID:', rfq.id);
      console.log('Reference:', rfq.referenceNumber);
      console.log('Company Name:', rfq.companyName);
      console.log('Contact Person:', rfq.contactPerson);
      console.log('Email:', rfq.email);
      console.log('Phone:', rfq.phone);
      console.log('Status:', rfq.status);
      console.log('Submitted At:', rfq.submittedAt);
      console.log('Items Count:', rfq.items?.length);
      console.log('Has User:', !!rfq.user);
      console.log('\n=== Full RFQ Object Keys ===');
      console.log(Object.keys(rfq));
    } else {
      console.log('RFQ not found!');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
