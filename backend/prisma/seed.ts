import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // =====================================================
  // SEED USERS
  // =====================================================
  console.log('👥 Seeding users...');

  const passwordHash = await bcrypt.hash('operator123', 10);

  const operator = await prisma.user.upsert({
    where: { email: 'operator@metalpro.ro' },
    update: {},
    create: {
      email: 'operator@metalpro.ro',
      passwordHash: passwordHash,
      name: 'Operator MetalPro',
      role: 'BACKOFFICE',
      emailVerified: true,
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@metalpro.ro' },
    update: {},
    create: {
      email: 'admin@metalpro.ro',
      passwordHash: passwordHash, // Using same password for demo
      name: 'Admin MetalPro',
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  console.log(`✅ Created 2 backoffice users\n`);

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

  // Get category IDs for product seeding
  const profilesCategory = categories.find((c) => c.slug === 'profiles')!;
  const platesCategory = categories.find((c) => c.slug === 'plates')!;
  const pipesCategory = categories.find((c) => c.slug === 'pipes')!;
  const fastenersCategory = categories.find((c) => c.slug === 'fasteners')!;
  const stainlessCategory = categories.find((c) => c.slug === 'stainless')!;
  const nonferrousCategory = categories.find((c) => c.slug === 'nonferrous')!;

  // =====================================================
  // SEED ALL PRODUCTS FROM FRONTEND MOCKED DATA
  // =====================================================
  console.log('📦 Seeding all products from catalog...');

  const products = await Promise.all([
    // ==================== PROFILE PRODUCTS ====================

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
          slug: 'hea-100-s235jr',
          description: 'Profil HEA 100 laminat la cald conform EN 10025',
          standards: ['EN 10025', 'EN 10034'],
          dimensions: {
            height: 96,
            width: 100,
            webThickness: 5,
            flangeThickness: 8,
            weightPerM: 16.7,
          },
          lengthOptionsM: [6, 12],
          densityKgPerM3: 7850,
          sectionProps: {
            linearMassKgPerM: 16.7,
            crossSectionArea: 21.2,
          },
          producer: 'ArcelorMittal',
          deliveryEstimate: { windowDays: [3, 5], feeBand: '50-100 RON' },
        },
      },
    }),

    // HEA 200
    prisma.product.upsert({
      where: { sku: 'HEA200-S235' },
      update: {},
      create: {
        categoryId: profilesCategory.id,
        sku: 'HEA200-S235',
        title: 'HEA 200 S235JR',
        grade: 'S235JR',
        standard: 'EN 10025, EN 10034',
        dimensions: 'H190 x W200 x tw6.5 x tf10',
        availability: 'in_stock',
        baseUnit: 'm',
        pricePerUnit: 120.0,
        weight: 42.3,
        lengthM: 6.0,
        metadata: {
          family: 'profiles',
          slug: 'hea-200-s235jr',
          description: 'Profil HEA 200 laminat la cald conform EN 10025',
          standards: ['EN 10025', 'EN 10034'],
          dimensions: {
            height: 190,
            width: 200,
            webThickness: 6.5,
            flangeThickness: 10,
            weightPerM: 42.3,
          },
          lengthOptionsM: [6, 12],
          densityKgPerM3: 7850,
          sectionProps: {
            linearMassKgPerM: 42.3,
            crossSectionArea: 53.8,
          },
          producer: 'ArcelorMittal',
          deliveryEstimate: { windowDays: [3, 5], feeBand: '50-100 RON' },
        },
      },
    }),

    // HEA 300
    prisma.product.upsert({
      where: { sku: 'HEA300-S355' },
      update: {},
      create: {
        categoryId: profilesCategory.id,
        sku: 'HEA300-S355',
        title: 'HEA 300 S355JR',
        grade: 'S355JR',
        standard: 'EN 10025, EN 10034',
        dimensions: 'H290 x W300 x tw8.5 x tf14',
        availability: 'in_stock',
        baseUnit: 'm',
        pricePerUnit: 255.0,
        weight: 88.3,
        lengthM: 6.0,
        metadata: {
          family: 'profiles',
          slug: 'hea-300-s355jr',
          description: 'Profil HEA 300 laminat la cald conform EN 10025',
          standards: ['EN 10025', 'EN 10034'],
          dimensions: {
            height: 290,
            width: 300,
            webThickness: 8.5,
            flangeThickness: 14,
            weightPerM: 88.3,
          },
          lengthOptionsM: [6, 12],
          densityKgPerM3: 7850,
          sectionProps: {
            linearMassKgPerM: 88.3,
            crossSectionArea: 112.5,
          },
          producer: 'ArcelorMittal',
          deliveryEstimate: { windowDays: [5, 7], feeBand: '100-150 RON' },
        },
      },
    }),

    // UNP 80
    prisma.product.upsert({
      where: { sku: 'UNP80-S235' },
      update: {},
      create: {
        categoryId: profilesCategory.id,
        sku: 'UNP80-S235',
        title: 'UNP 80 S235JR',
        grade: 'S235JR',
        standard: 'EN 10025, EN 10365',
        dimensions: 'H80 x W45 x tw4 x tf7',
        availability: 'in_stock',
        baseUnit: 'm',
        pricePerUnit: 28.5,
        weight: 8.64,
        lengthM: 6.0,
        metadata: {
          family: 'profiles',
          slug: 'unp-80-s235jr',
          description: 'Profil UNP 80 canal U laminat la cald',
          standards: ['EN 10025', 'EN 10365'],
          dimensions: {
            height: 80,
            width: 45,
            webThickness: 4,
            flangeThickness: 7,
            weightPerM: 8.64,
          },
          lengthOptionsM: [6, 12],
          densityKgPerM3: 7850,
          sectionProps: {
            linearMassKgPerM: 8.64,
            crossSectionArea: 11.0,
          },
          deliveryEstimate: { windowDays: [3, 5], feeBand: '50-100 RON' },
        },
      },
    }),

    // UNP 200
    prisma.product.upsert({
      where: { sku: 'UNP200-S235' },
      update: {},
      create: {
        categoryId: profilesCategory.id,
        sku: 'UNP200-S235',
        title: 'UNP 200 S235JR',
        grade: 'S235JR',
        standard: 'EN 10025, EN 10365',
        dimensions: 'H200 x W75 x tw5.5 x tf11',
        availability: 'in_stock',
        baseUnit: 'm',
        pricePerUnit: 77.5,
        weight: 25.3,
        lengthM: 6.0,
        metadata: {
          family: 'profiles',
          slug: 'unp-200-s235jr',
          description: 'Profil UNP 200 canal U laminat la cald',
          standards: ['EN 10025', 'EN 10365'],
          dimensions: {
            height: 200,
            width: 75,
            webThickness: 5.5,
            flangeThickness: 11,
            weightPerM: 25.3,
          },
          lengthOptionsM: [6, 12],
          densityKgPerM3: 7850,
          sectionProps: {
            linearMassKgPerM: 25.3,
            crossSectionArea: 32.2,
          },
          deliveryEstimate: { windowDays: [3, 5], feeBand: '50-100 RON' },
        },
      },
    }),

    // IPE 160
    prisma.product.upsert({
      where: { sku: 'IPE160-S235' },
      update: {},
      create: {
        categoryId: profilesCategory.id,
        sku: 'IPE160-S235',
        title: 'IPE 160 S235JR',
        grade: 'S235JR',
        standard: 'EN 10025, EN 10034',
        dimensions: 'H160 x W82 x tw5 x tf7.4',
        availability: 'in_stock',
        baseUnit: 'm',
        pricePerUnit: 47.0,
        weight: 15.8,
        lengthM: 6.0,
        metadata: {
          family: 'profiles',
          slug: 'ipe-160-s235jr',
          description: 'Profil IPE 160 laminat la cald conform EN 10025',
          standards: ['EN 10025', 'EN 10034'],
          dimensions: {
            height: 160,
            width: 82,
            webThickness: 5,
            flangeThickness: 7.4,
            weightPerM: 15.8,
          },
          lengthOptionsM: [6, 12],
          densityKgPerM3: 7850,
          sectionProps: {
            linearMassKgPerM: 15.8,
            crossSectionArea: 20.1,
          },
          deliveryEstimate: { windowDays: [3, 5], feeBand: '50-100 RON' },
        },
      },
    }),

    // ==================== PLATE PRODUCTS ====================

    // Plate S235JR 6mm
    prisma.product.upsert({
      where: { sku: 'PLT-S235-6' },
      update: {},
      create: {
        categoryId: platesCategory.id,
        sku: 'PLT-S235-6',
        title: 'Tablă S235JR 6mm',
        grade: 'S235JR',
        standard: 'EN 10025, EN 10051',
        dimensions: '6mm x 1500mm x 6000mm',
        availability: 'in_stock',
        baseUnit: 'kg',
        pricePerUnit: 3.85,
        weight: 47.1, // per m2
        metadata: {
          family: 'plates',
          slug: 'plate-s235jr-6mm',
          description: 'Tablă de oțel laminată la cald grosime 6mm',
          standards: ['EN 10025', 'EN 10051'],
          dimensions: {
            thickness: 6,
            widthMm: 1500,
            lengthMm: 6000,
            weightPerM2: 47.1,
          },
          densityKgPerM3: 7850,
          deliveryEstimate: { windowDays: [3, 5], feeBand: '100-200 RON' },
        },
      },
    }),

    // Plate S235JR 10mm
    prisma.product.upsert({
      where: { sku: 'PLT-S235-10' },
      update: {},
      create: {
        categoryId: platesCategory.id,
        sku: 'PLT-S235-10',
        title: 'Tablă S235JR 10mm',
        grade: 'S235JR',
        standard: 'EN 10025, EN 10051',
        dimensions: '10mm x 1500mm x 6000mm',
        availability: 'in_stock',
        baseUnit: 'kg',
        pricePerUnit: 3.85,
        weight: 78.5, // per m2
        metadata: {
          family: 'plates',
          slug: 'plate-s235jr-10mm',
          description: 'Tablă de oțel laminată la cald grosime 10mm',
          standards: ['EN 10025', 'EN 10051'],
          dimensions: {
            thickness: 10,
            widthMm: 1500,
            lengthMm: 6000,
            weightPerM2: 78.5,
          },
          densityKgPerM3: 7850,
          deliveryEstimate: { windowDays: [3, 5], feeBand: '100-200 RON' },
        },
      },
    }),

    // Plate S355JR 15mm
    prisma.product.upsert({
      where: { sku: 'PLT-S355-15' },
      update: {},
      create: {
        categoryId: platesCategory.id,
        sku: 'PLT-S355-15',
        title: 'Tablă S355JR 15mm',
        grade: 'S355JR',
        standard: 'EN 10025, EN 10051',
        dimensions: '15mm x 1500mm x 6000mm',
        availability: 'in_stock',
        baseUnit: 'kg',
        pricePerUnit: 4.15,
        weight: 117.75, // per m2
        metadata: {
          family: 'plates',
          slug: 'plate-s355jr-15mm',
          description: 'Tablă de oțel laminată la cald grosime 15mm',
          standards: ['EN 10025', 'EN 10051'],
          dimensions: {
            thickness: 15,
            widthMm: 1500,
            lengthMm: 6000,
            weightPerM2: 117.75,
          },
          densityKgPerM3: 7850,
          deliveryEstimate: { windowDays: [5, 7], feeBand: '150-250 RON' },
        },
      },
    }),

    // Plate DC01 1mm
    prisma.product.upsert({
      where: { sku: 'PLT-DC01-1' },
      update: {},
      create: {
        categoryId: platesCategory.id,
        sku: 'PLT-DC01-1',
        title: 'Tablă DC01 1mm',
        grade: 'DC01',
        standard: 'EN 10130',
        dimensions: '1mm x 1250mm x 2500mm',
        availability: 'in_stock',
        baseUnit: 'kg',
        pricePerUnit: 4.6,
        weight: 7.85, // per m2
        metadata: {
          family: 'plates',
          slug: 'plate-dc01-1mm',
          description: 'Tablă laminată la rece pentru deformare la rece',
          standards: ['EN 10130'],
          dimensions: {
            thickness: 1,
            widthMm: 1250,
            lengthMm: 2500,
            weightPerM2: 7.85,
          },
          densityKgPerM3: 7850,
          deliveryEstimate: { windowDays: [3, 5], feeBand: '50-100 RON' },
        },
      },
    }),

    // ==================== PIPE PRODUCTS ====================

    // Rectangular Pipe 40x20x2
    prisma.product.upsert({
      where: { sku: 'PIPE-RECT-40x20x2' },
      update: {},
      create: {
        categoryId: pipesCategory.id,
        sku: 'PIPE-RECT-40x20x2',
        title: 'Țeavă rectangulară 40x20x2mm',
        grade: 'S235JRH',
        standard: 'EN 10219',
        dimensions: '40 x 20 x 2mm',
        availability: 'in_stock',
        baseUnit: 'm',
        pricePerUnit: 9.5,
        weight: 2.27,
        lengthM: 6.0,
        metadata: {
          family: 'pipes',
          slug: 'pipe-rect-40x20x2',
          description: 'Țeavă rectangulară sudată conform EN 10219',
          standards: ['EN 10219'],
          dimensions: {
            height: 40,
            width: 20,
            thickness: 2,
            weightPerM: 2.27,
          },
          lengthOptionsM: [6, 12],
          densityKgPerM3: 7850,
          sectionProps: {
            linearMassKgPerM: 2.27,
          },
          deliveryEstimate: { windowDays: [3, 5], feeBand: '50-100 RON' },
        },
      },
    }),

    // Rectangular Pipe 100x60x3
    prisma.product.upsert({
      where: { sku: 'PIPE-RECT-100x60x3' },
      update: {},
      create: {
        categoryId: pipesCategory.id,
        sku: 'PIPE-RECT-100x60x3',
        title: 'Țeavă rectangulară 100x60x3mm',
        grade: 'S235JRH',
        standard: 'EN 10219',
        dimensions: '100 x 60 x 3mm',
        availability: 'in_stock',
        baseUnit: 'm',
        pricePerUnit: 35.0,
        weight: 11.1,
        lengthM: 6.0,
        metadata: {
          family: 'pipes',
          slug: 'pipe-rect-100x60x3',
          description: 'Țeavă rectangulară sudată conform EN 10219',
          standards: ['EN 10219'],
          dimensions: {
            height: 100,
            width: 60,
            thickness: 3,
            weightPerM: 11.1,
          },
          lengthOptionsM: [6, 12],
          densityKgPerM3: 7850,
          sectionProps: {
            linearMassKgPerM: 11.1,
          },
          deliveryEstimate: { windowDays: [3, 5], feeBand: '50-100 RON' },
        },
      },
    }),

    // Round Pipe 48.3x3
    prisma.product.upsert({
      where: { sku: 'PIPE-RND-48.3x3' },
      update: {},
      create: {
        categoryId: pipesCategory.id,
        sku: 'PIPE-RND-48.3x3',
        title: 'Țeavă rotundă Ø48.3x3mm',
        grade: 'S235JRH',
        standard: 'EN 10219',
        dimensions: 'OD 48.3 x WT 3mm',
        availability: 'in_stock',
        baseUnit: 'm',
        pricePerUnit: 12.5,
        weight: 3.32,
        lengthM: 6.0,
        metadata: {
          family: 'pipes',
          slug: 'pipe-round-48-3x3',
          description: 'Țeavă rotundă sudată conform EN 10219',
          standards: ['EN 10219'],
          dimensions: {
            diameter: 48.3,
            thickness: 3,
            weightPerM: 3.32,
          },
          lengthOptionsM: [6, 12],
          densityKgPerM3: 7850,
          sectionProps: {
            linearMassKgPerM: 3.32,
          },
          deliveryEstimate: { windowDays: [3, 5], feeBand: '50-100 RON' },
        },
      },
    }),

    // ==================== FASTENER PRODUCTS ====================

    // Bolt M10x40
    prisma.product.upsert({
      where: { sku: 'BOLT-M10x40-8.8' },
      update: {},
      create: {
        categoryId: fastenersCategory.id,
        sku: 'BOLT-M10x40-8.8',
        title: 'Șurub M10x40 clasa 8.8 zincat',
        grade: 'Clasa 8.8',
        standard: 'DIN 933, ISO 4017',
        dimensions: 'M10 x 40mm',
        availability: 'in_stock',
        baseUnit: 'pcs',
        pricePerUnit: 0.55,
        metadata: {
          family: 'fasteners',
          slug: 'bolt-m10x40-class-8-8',
          description: 'Șurub cap hexagonal conform DIN 933',
          standards: ['DIN 933', 'ISO 4017'],
          dimensions: {
            diameter: 10,
            length: 40,
            threadLength: 26,
          },
          deliveryEstimate: { windowDays: [1, 3], feeBand: '30-50 RON' },
        },
      },
    }),

    // Nut M10
    prisma.product.upsert({
      where: { sku: 'NUT-M10-8' },
      update: {},
      create: {
        categoryId: fastenersCategory.id,
        sku: 'NUT-M10-8',
        title: 'Piuliță M10 clasa 8 zincată',
        grade: 'Clasa 8',
        standard: 'DIN 934, ISO 4032',
        dimensions: 'M10 x 8mm',
        availability: 'in_stock',
        baseUnit: 'pcs',
        pricePerUnit: 0.20,
        metadata: {
          family: 'fasteners',
          slug: 'nut-m10-class-8',
          description: 'Piuliță hexagonală conform DIN 934',
          standards: ['DIN 934', 'ISO 4032'],
          dimensions: {
            diameter: 10,
            height: 8,
          },
          deliveryEstimate: { windowDays: [1, 3], feeBand: '30-50 RON' },
        },
      },
    }),

    // ==================== STAINLESS STEEL PRODUCTS ====================

    // Stainless Plate 304 2mm
    prisma.product.upsert({
      where: { sku: 'PLT-304-2' },
      update: {},
      create: {
        categoryId: stainlessCategory.id,
        sku: 'PLT-304-2',
        title: 'Tablă inox AISI 304 2mm',
        grade: 'AISI 304 (1.4301)',
        standard: 'EN 10088-2, ASTM A240',
        dimensions: '2mm x 1250mm x 2500mm',
        availability: 'on_order',
        baseUnit: 'kg',
        pricePerUnit: 31.5,
        weight: 15.7, // per m2
        metadata: {
          family: 'stainless',
          slug: 'plate-stainless-304-2mm',
          description: 'Tablă oțel inoxidabil 2mm finisaj 2B',
          standards: ['EN 10088-2', 'ASTM A240'],
          dimensions: {
            thickness: 2,
            widthMm: 1250,
            lengthMm: 2500,
            weightPerM2: 15.7,
          },
          densityKgPerM3: 7850,
          deliveryEstimate: { windowDays: [7, 10], feeBand: '150-250 RON' },
        },
      },
    }),

    // Stainless Pipe 304 50x2
    prisma.product.upsert({
      where: { sku: 'PIPE-304-50x2' },
      update: {},
      create: {
        categoryId: stainlessCategory.id,
        sku: 'PIPE-304-50x2',
        title: 'Țeavă inox AISI 304 Ø50x2mm',
        grade: 'AISI 304 (1.4301)',
        standard: 'EN 10217-7',
        dimensions: 'OD 50 x WT 2mm',
        availability: 'on_order',
        baseUnit: 'm',
        pricePerUnit: 95.0,
        weight: 2.89,
        lengthM: 6.0,
        metadata: {
          family: 'stainless',
          slug: 'pipe-stainless-304-50x2',
          description: 'Țeavă rotundă oțel inoxidabil',
          standards: ['EN 10217-7'],
          dimensions: {
            diameter: 50,
            thickness: 2,
            weightPerM: 2.89,
          },
          lengthOptionsM: [6],
          densityKgPerM3: 7850,
          sectionProps: {
            linearMassKgPerM: 2.89,
          },
          deliveryEstimate: { windowDays: [7, 10], feeBand: '100-150 RON' },
        },
      },
    }),

    // ==================== NON-FERROUS PRODUCTS ====================

    // Aluminum Profile 6060
    prisma.product.upsert({
      where: { sku: 'ALU-6060-30x30x2' },
      update: {},
      create: {
        categoryId: nonferrousCategory.id,
        sku: 'ALU-6060-30x30x2',
        title: 'Profil aluminiu 6060 30x30x2mm',
        grade: 'Al 6060 T66',
        standard: 'EN 755-9',
        dimensions: '30 x 30 x 2mm',
        availability: 'in_stock',
        baseUnit: 'm',
        pricePerUnit: 21.0,
        weight: 0.52,
        lengthM: 6.0,
        metadata: {
          family: 'nonferrous',
          slug: 'aluminum-profile-6060-30x30x2',
          description: 'Profil pătrată aluminiu',
          standards: ['EN 755-9'],
          dimensions: {
            height: 30,
            width: 30,
            thickness: 2,
            weightPerM: 0.52,
          },
          lengthOptionsM: [6],
          densityKgPerM3: 2700,
          sectionProps: {
            linearMassKgPerM: 0.52,
          },
          deliveryEstimate: { windowDays: [5, 7], feeBand: '50-100 RON' },
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
  console.log('👥 Backoffice Users: 2');
  console.log('   - operator@metalpro.ro (BACKOFFICE) - password: operator123');
  console.log('   - admin@metalpro.ro (ADMIN) - password: operator123');
  console.log(`📂 Categories: ${categories.length}`);
  console.log(`📦 Products: ${products.length}`);
  console.log('');
  console.log('Product breakdown by category:');
  console.log(`  - Profile Metalice: 6 products`);
  console.log(`  - Table de Oțel: 4 products`);
  console.log(`  - Țevi și Tuburi: 3 products`);
  console.log(`  - Elemente de Asamblare: 2 products`);
  console.log(`  - Oțel Inoxidabil: 2 products`);
  console.log(`  - Metale Neferoase: 1 product`);
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
