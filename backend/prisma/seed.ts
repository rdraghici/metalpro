import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Import product data from frontend
// In a real scenario, you'd import this from a shared location
// For now, we'll create sample data matching the frontend structure

async function main() {
  console.log('🌱 Starting database seed...\n');

  // =====================================================
  // SEED CATEGORIES
  // =====================================================
  console.log('📂 Seeding categories...');

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'profiles' },
      update: {},
      create: {
        slug: 'profiles',
        name: 'Profile Metalice',
        nameEn: 'Metal Profiles',
        description: 'Profile laminat la cald pentru structuri metalice',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'plates' },
      update: {},
      create: {
        slug: 'plates',
        name: 'Table de Oțel',
        nameEn: 'Steel Plates',
        description: 'Table pentru construcții și industrie',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'pipes' },
      update: {},
      create: {
        slug: 'pipes',
        name: 'Țevi și Tuburi',
        nameEn: 'Pipes and Tubes',
        description: 'Țevi sudate și fără sudură',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'fasteners' },
      update: {},
      create: {
        slug: 'fasteners',
        name: 'Elemente de Asamblare',
        nameEn: 'Fasteners',
        description: 'Șuruburi, piulițe, rondele conform DIN/ISO',
        sortOrder: 4,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'stainless' },
      update: {},
      create: {
        slug: 'stainless',
        name: 'Oțel Inoxidabil',
        nameEn: 'Stainless Steel',
        description: 'Table, profile, țevi inox pentru aplicații speciale',
        sortOrder: 5,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'nonferrous' },
      update: {},
      create: {
        slug: 'nonferrous',
        name: 'Metale Neferoase',
        nameEn: 'Non-ferrous Metals',
        description: 'Aluminiu, cupru, bronz pentru aplicații diverse',
        sortOrder: 6,
      },
    }),
  ]);

  console.log(`✅ Created ${categories.length} categories\n`);

  // =====================================================
  // SEED SAMPLE PRODUCTS
  // =====================================================
  console.log('📦 Seeding sample products...');

  const profilesCategory = categories.find((c) => c.slug === 'profiles')!;
  const platesCategory = categories.find((c) => c.slug === 'plates')!;
  const pipesCategory = categories.find((c) => c.slug === 'pipes')!;

  // Sample products (HEA profiles)
  const products = await Promise.all([
    // HEA 100
    prisma.product.upsert({
      where: { sku: 'HEA100-S235' },
      update: {},
      create: {
        categoryId: profilesCategory.id,
        sku: 'HEA100-S235',
        title: 'HEA 100 S235JR',
        grade: 'S235JR',
        standard: 'EN 10025, EN 10034',
        dimensions: 'H96 x W100 x tw5 x tf8',
        availability: 'in_stock',
        baseUnit: 'm',
        pricePerUnit: 50.0,
        weight: 16.7,
        lengthM: 6.0,
        metadata: {
          family: 'profiles',
          producer: 'ArcelorMittal',
          deliveryEstimate: { windowDays: [3, 5], feeBand: '50-100 RON' },
        },
      },
    }),
    // HEA 120
    prisma.product.upsert({
      where: { sku: 'HEA120-S235' },
      update: {},
      create: {
        categoryId: profilesCategory.id,
        sku: 'HEA120-S235',
        title: 'HEA 120 S235JR',
        grade: 'S235JR',
        standard: 'EN 10025, EN 10034',
        dimensions: 'H114 x W120 x tw5 x tf8',
        availability: 'in_stock',
        baseUnit: 'm',
        pricePerUnit: 65.0,
        weight: 19.9,
        lengthM: 6.0,
        metadata: {
          family: 'profiles',
          producer: 'ArcelorMittal',
          deliveryEstimate: { windowDays: [3, 5], feeBand: '50-100 RON' },
        },
      },
    }),
    // Steel Plate 10mm
    prisma.product.upsert({
      where: { sku: 'PLATE-S235-10MM' },
      update: {},
      create: {
        categoryId: platesCategory.id,
        sku: 'PLATE-S235-10MM',
        title: 'Tablă Oțel S235JR 10mm',
        grade: 'S235JR',
        standard: 'EN 10025-2',
        dimensions: '2000 x 1000 x 10mm',
        availability: 'in_stock',
        baseUnit: 'kg',
        pricePerUnit: 4.5,
        weight: 157.0, // kg per sheet (2000x1000x10mm)
        metadata: {
          family: 'plates',
          sheetSize: { width: 1000, length: 2000, thickness: 10 },
          producer: 'Marcegaglia',
          deliveryEstimate: { windowDays: [5, 7], feeBand: '100-200 RON' },
        },
      },
    }),
    // Round Pipe
    prisma.product.upsert({
      where: { sku: 'PIPE-ROUND-60.3x3.6' },
      update: {},
      create: {
        categoryId: pipesCategory.id,
        sku: 'PIPE-ROUND-60.3x3.6',
        title: 'Țeavă Rotundă 60.3 x 3.6mm S235JRH',
        grade: 'S235JRH',
        standard: 'EN 10219-1',
        dimensions: 'OD 60.3 x WT 3.6mm',
        availability: 'in_stock',
        baseUnit: 'm',
        pricePerUnit: 28.0,
        weight: 5.03,
        lengthM: 6.0,
        metadata: {
          family: 'pipes',
          pipeType: 'welded',
          producer: 'Vallourec',
          deliveryEstimate: { windowDays: [3, 5], feeBand: '50-100 RON' },
        },
      },
    }),
    // Square Pipe
    prisma.product.upsert({
      where: { sku: 'PIPE-SQUARE-50x50x3' },
      update: {},
      create: {
        categoryId: pipesCategory.id,
        sku: 'PIPE-SQUARE-50x50x3',
        title: 'Țeavă Pătrată 50 x 50 x 3mm S235JRH',
        grade: 'S235JRH',
        standard: 'EN 10219-2',
        dimensions: '50 x 50 x 3mm',
        availability: 'in_stock',
        baseUnit: 'm',
        pricePerUnit: 22.0,
        weight: 4.31,
        lengthM: 6.0,
        metadata: {
          family: 'pipes',
          pipeType: 'welded',
          producer: 'Vallourec',
          deliveryEstimate: { windowDays: [3, 5], feeBand: '50-100 RON' },
        },
      },
    }),
  ]);

  console.log(`✅ Created ${products.length} products\n`);

  // =====================================================
  // SUMMARY
  // =====================================================
  console.log('='.repeat(60));
  console.log('✅ Database seeding completed successfully!');
  console.log('='.repeat(60));
  console.log(`📂 Categories: ${categories.length}`);
  console.log(`📦 Products: ${products.length}`);
  console.log('='.repeat(60));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
