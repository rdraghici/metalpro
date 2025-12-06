import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed Categories
 * Migrates static category definitions to database
 * Based on categories from src/data/products.ts
 */

const categories = [
  {
    slug: 'profiles',
    name: 'Profile Metalice',
    nameEn: 'Metal Profiles',
    description: 'Profile laminat la cald pentru structuri metalice',
    icon: 'shapes',
    sortOrder: 1,
  },
  {
    slug: 'plates',
    name: 'Table de Oțel',
    nameEn: 'Steel Plates',
    description: 'Table pentru construcții și industrie',
    icon: 'square',
    sortOrder: 2,
  },
  {
    slug: 'pipes',
    name: 'Țevi și Conducte',
    nameEn: 'Pipes and Tubes',
    description: 'Țevi și conducte pentru aplicații diverse',
    icon: 'pipe',
    sortOrder: 3,
  },
  {
    slug: 'fasteners',
    name: 'Elemente de Fixare',
    nameEn: 'Fasteners',
    description: 'Șuruburi, buloane, piulițe și alte elemente de fixare',
    icon: 'bolt',
    sortOrder: 4,
  },
  {
    slug: 'stainless',
    name: 'Inox',
    nameEn: 'Stainless Steel',
    description: 'Produse din oțel inoxidabil',
    icon: 'sparkles',
    sortOrder: 5,
  },
  {
    slug: 'nonferrous',
    name: 'Metale Neferoase',
    nameEn: 'Non-Ferrous Metals',
    description: 'Aluminiu, cupru, alamă și alte metale neferoase',
    icon: 'layers',
    sortOrder: 6,
  },
];

async function seedCategories() {
  console.log('🌱 Seeding categories...');

  try {
    // Use upsert to avoid duplicates and allow re-running the seed script
    for (const category of categories) {
      const result = await prisma.category.upsert({
        where: { slug: category.slug },
        update: {
          name: category.name,
          nameEn: category.nameEn,
          description: category.description,
          icon: category.icon,
          sortOrder: category.sortOrder,
        },
        create: category,
      });

      console.log(`  ✓ ${result.name} (${result.slug})`);
    }

    console.log('✅ Categories seeded successfully!\n');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
}

async function main() {
  console.log('\n==========================================');
  console.log('MetalPro - Category Seed Script');
  console.log('==========================================\n');

  await seedCategories();

  console.log('==========================================');
  console.log('Seed completed successfully!');
  console.log('==========================================\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
