import type { Product, Category } from '@/types';

// =====================================================
// CATEGORIES
// =====================================================

export const categories: Category[] = [
  {
    id: 'cat-profiles',
    slug: 'profiles',
    name: 'Profile Metalice',
    description: 'Profile laminat la cald pentru structuri metalice',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-plates',
    slug: 'plates',
    name: 'Table de Oțel',
    description: 'Table pentru construcții și industrie',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-pipes',
    slug: 'pipes',
    name: 'Țevi și Tuburi',
    description: 'Țevi sudate și fără sudură',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-fasteners',
    slug: 'fasteners',
    name: 'Elemente de Asamblare',
    description: 'Șuruburi, piulițe, rondele conform DIN/ISO',
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'cat-stainless',
    slug: 'stainless',
    name: 'Oțel Inoxidabil',
    description: 'Table, profile, țevi inox pentru aplicații speciale',
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 'cat-nonferrous',
    slug: 'nonferrous',
    name: 'Metale Neferoase',
    description: 'Aluminiu, cupru, bronz pentru aplicații diverse',
    displayOrder: 6,
    isActive: true,
  },
];

// =====================================================
// PRODUCTS - PROFILES
// =====================================================

export const profileProducts: Product[] = [
  // HEA Profiles
  {
    id: 'prod-hea-100-s235jr',
    slug: 'hea-100-s235jr',
    sku: 'HEA100-S235',
    family: 'profiles',
    categoryId: 'cat-profiles',
    title: 'HEA 100 S235JR',
    description: 'Profil HEA 100 laminat la cald conform EN 10025',
    standards: ['EN 10025', 'EN 10034'],
    grade: 'S235JR',
    dimensions: {
      height: 96,
      width: 100,
      webThickness: 5,
      flangeThickness: 8,
      weightPerM: 16.7,
    },
    lengthOptionsM: [6, 12],
    baseUnit: 'm',
    indicativePrice: {
      currency: 'RON',
      unit: 'm',
      min: 45,
      max: 55,
    },
    densityKgPerM3: 7850,
    sectionProps: {
      linearMassKgPerM: 16.7,
      crossSectionArea: 21.2,
    },
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [3, 5],
      feeBand: '50-100 RON',
    },
    producer: 'ArcelorMittal',
    isActive: true,
  },
  {
    id: 'prod-hea-200-s235jr',
    slug: 'hea-200-s235jr',
    sku: 'HEA200-S235',
    family: 'profiles',
    categoryId: 'cat-profiles',
    title: 'HEA 200 S235JR',
    description: 'Profil HEA 200 laminat la cald conform EN 10025',
    standards: ['EN 10025', 'EN 10034'],
    grade: 'S235JR',
    dimensions: {
      height: 190,
      width: 200,
      webThickness: 6.5,
      flangeThickness: 10,
      weightPerM: 42.3,
    },
    lengthOptionsM: [6, 12],
    baseUnit: 'm',
    indicativePrice: {
      currency: 'RON',
      unit: 'm',
      min: 110,
      max: 130,
    },
    densityKgPerM3: 7850,
    sectionProps: {
      linearMassKgPerM: 42.3,
      crossSectionArea: 53.8,
    },
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [3, 5],
      feeBand: '50-100 RON',
    },
    producer: 'ArcelorMittal',
    isActive: true,
  },
  {
    id: 'prod-hea-300-s355jr',
    slug: 'hea-300-s355jr',
    sku: 'HEA300-S355',
    family: 'profiles',
    categoryId: 'cat-profiles',
    title: 'HEA 300 S355JR',
    description: 'Profil HEA 300 laminat la cald conform EN 10025',
    standards: ['EN 10025', 'EN 10034'],
    grade: 'S355JR',
    dimensions: {
      height: 290,
      width: 300,
      webThickness: 8.5,
      flangeThickness: 14,
      weightPerM: 88.3,
    },
    lengthOptionsM: [6, 12],
    baseUnit: 'm',
    indicativePrice: {
      currency: 'RON',
      unit: 'm',
      min: 240,
      max: 270,
    },
    densityKgPerM3: 7850,
    sectionProps: {
      linearMassKgPerM: 88.3,
      crossSectionArea: 112.5,
    },
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [5, 7],
      feeBand: '100-150 RON',
    },
    producer: 'ArcelorMittal',
    isActive: true,
  },

  // UNP Profiles
  {
    id: 'prod-unp-80-s235jr',
    slug: 'unp-80-s235jr',
    sku: 'UNP80-S235',
    family: 'profiles',
    categoryId: 'cat-profiles',
    title: 'UNP 80 S235JR',
    description: 'Profil UNP 80 canal U laminat la cald',
    standards: ['EN 10025', 'EN 10365'],
    grade: 'S235JR',
    dimensions: {
      height: 80,
      width: 45,
      webThickness: 4,
      flangeThickness: 7,
      weightPerM: 8.64,
    },
    lengthOptionsM: [6, 12],
    baseUnit: 'm',
    indicativePrice: {
      currency: 'RON',
      unit: 'm',
      min: 25,
      max: 32,
    },
    densityKgPerM3: 7850,
    sectionProps: {
      linearMassKgPerM: 8.64,
      crossSectionArea: 11.0,
    },
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [3, 5],
      feeBand: '50-100 RON',
    },
    isActive: true,
  },
  {
    id: 'prod-unp-200-s235jr',
    slug: 'unp-200-s235jr',
    sku: 'UNP200-S235',
    family: 'profiles',
    categoryId: 'cat-profiles',
    title: 'UNP 200 S235JR',
    description: 'Profil UNP 200 canal U laminat la cald',
    standards: ['EN 10025', 'EN 10365'],
    grade: 'S235JR',
    dimensions: {
      height: 200,
      width: 75,
      webThickness: 5.5,
      flangeThickness: 11,
      weightPerM: 25.3,
    },
    lengthOptionsM: [6, 12],
    baseUnit: 'm',
    indicativePrice: {
      currency: 'RON',
      unit: 'm',
      min: 70,
      max: 85,
    },
    densityKgPerM3: 7850,
    sectionProps: {
      linearMassKgPerM: 25.3,
      crossSectionArea: 32.2,
    },
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [3, 5],
      feeBand: '50-100 RON',
    },
    isActive: true,
  },

  // IPE Profiles
  {
    id: 'prod-ipe-160-s235jr',
    slug: 'ipe-160-s235jr',
    sku: 'IPE160-S235',
    family: 'profiles',
    categoryId: 'cat-profiles',
    title: 'IPE 160 S235JR',
    description: 'Profil IPE 160 laminat la cald conform EN 10025',
    standards: ['EN 10025', 'EN 10034'],
    grade: 'S235JR',
    dimensions: {
      height: 160,
      width: 82,
      webThickness: 5,
      flangeThickness: 7.4,
      weightPerM: 15.8,
    },
    lengthOptionsM: [6, 12],
    baseUnit: 'm',
    indicativePrice: {
      currency: 'RON',
      unit: 'm',
      min: 42,
      max: 52,
    },
    densityKgPerM3: 7850,
    sectionProps: {
      linearMassKgPerM: 15.8,
      crossSectionArea: 20.1,
    },
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [3, 5],
      feeBand: '50-100 RON',
    },
    isActive: true,
  },
];

// =====================================================
// PRODUCTS - STEEL PLATES
// =====================================================

export const plateProducts: Product[] = [
  {
    id: 'prod-plate-s235jr-6mm',
    slug: 'plate-s235jr-6mm',
    sku: 'PLT-S235-6',
    family: 'plates',
    categoryId: 'cat-plates',
    title: 'Tablă S235JR 6mm',
    description: 'Tablă de oțel laminată la cald grosime 6mm',
    standards: ['EN 10025', 'EN 10051'],
    grade: 'S235JR',
    dimensions: {
      thickness: 6,
      widthMm: 1500,
      lengthMm: 6000,
      weightPerM2: 47.1,
    },
    baseUnit: 'kg',
    indicativePrice: {
      currency: 'RON',
      unit: 'kg',
      min: 3.5,
      max: 4.2,
    },
    densityKgPerM3: 7850,
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [3, 5],
      feeBand: '100-200 RON',
    },
    isActive: true,
  },
  {
    id: 'prod-plate-s235jr-10mm',
    slug: 'plate-s235jr-10mm',
    sku: 'PLT-S235-10',
    family: 'plates',
    categoryId: 'cat-plates',
    title: 'Tablă S235JR 10mm',
    description: 'Tablă de oțel laminată la cald grosime 10mm',
    standards: ['EN 10025', 'EN 10051'],
    grade: 'S235JR',
    dimensions: {
      thickness: 10,
      widthMm: 1500,
      lengthMm: 6000,
      weightPerM2: 78.5,
    },
    baseUnit: 'kg',
    indicativePrice: {
      currency: 'RON',
      unit: 'kg',
      min: 3.5,
      max: 4.2,
    },
    densityKgPerM3: 7850,
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [3, 5],
      feeBand: '100-200 RON',
    },
    isActive: true,
  },
  {
    id: 'prod-plate-s355jr-15mm',
    slug: 'plate-s355jr-15mm',
    sku: 'PLT-S355-15',
    family: 'plates',
    categoryId: 'cat-plates',
    title: 'Tablă S355JR 15mm',
    description: 'Tablă de oțel laminată la cald grosime 15mm',
    standards: ['EN 10025', 'EN 10051'],
    grade: 'S355JR',
    dimensions: {
      thickness: 15,
      widthMm: 1500,
      lengthMm: 6000,
      weightPerM2: 117.75,
    },
    baseUnit: 'kg',
    indicativePrice: {
      currency: 'RON',
      unit: 'kg',
      min: 3.8,
      max: 4.5,
    },
    densityKgPerM3: 7850,
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [5, 7],
      feeBand: '150-250 RON',
    },
    isActive: true,
  },
  {
    id: 'prod-plate-dc01-1mm',
    slug: 'plate-dc01-1mm',
    sku: 'PLT-DC01-1',
    family: 'plates',
    categoryId: 'cat-plates',
    title: 'Tablă DC01 1mm',
    description: 'Tablă laminată la rece pentru deformare la rece',
    standards: ['EN 10130'],
    grade: 'DC01',
    dimensions: {
      thickness: 1,
      widthMm: 1250,
      lengthMm: 2500,
      weightPerM2: 7.85,
    },
    baseUnit: 'kg',
    indicativePrice: {
      currency: 'RON',
      unit: 'kg',
      min: 4.2,
      max: 5.0,
    },
    densityKgPerM3: 7850,
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [3, 5],
      feeBand: '50-100 RON',
    },
    isActive: true,
  },
];

// =====================================================
// PRODUCTS - PIPES
// =====================================================

export const pipeProducts: Product[] = [
  {
    id: 'prod-pipe-rect-40x20x2',
    slug: 'pipe-rect-40x20x2',
    sku: 'PIPE-RECT-40x20x2',
    family: 'pipes',
    categoryId: 'cat-pipes',
    title: 'Țeavă rectangulară 40x20x2mm',
    description: 'Țeavă rectangulară sudată conform EN 10219',
    standards: ['EN 10219'],
    grade: 'S235JRH',
    dimensions: {
      height: 40,
      width: 20,
      thickness: 2,
      weightPerM: 2.27,
    },
    lengthOptionsM: [6, 12],
    baseUnit: 'm',
    indicativePrice: {
      currency: 'RON',
      unit: 'm',
      min: 8,
      max: 11,
    },
    densityKgPerM3: 7850,
    sectionProps: {
      linearMassKgPerM: 2.27,
    },
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [3, 5],
      feeBand: '50-100 RON',
    },
    isActive: true,
  },
  {
    id: 'prod-pipe-rect-100x60x3',
    slug: 'pipe-rect-100x60x3',
    sku: 'PIPE-RECT-100x60x3',
    family: 'pipes',
    categoryId: 'cat-pipes',
    title: 'Țeavă rectangulară 100x60x3mm',
    description: 'Țeavă rectangulară sudată conform EN 10219',
    standards: ['EN 10219'],
    grade: 'S235JRH',
    dimensions: {
      height: 100,
      width: 60,
      thickness: 3,
      weightPerM: 11.1,
    },
    lengthOptionsM: [6, 12],
    baseUnit: 'm',
    indicativePrice: {
      currency: 'RON',
      unit: 'm',
      min: 32,
      max: 38,
    },
    densityKgPerM3: 7850,
    sectionProps: {
      linearMassKgPerM: 11.1,
    },
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [3, 5],
      feeBand: '50-100 RON',
    },
    isActive: true,
  },
  {
    id: 'prod-pipe-round-48.3x3',
    slug: 'pipe-round-48-3x3',
    sku: 'PIPE-RND-48.3x3',
    family: 'pipes',
    categoryId: 'cat-pipes',
    title: 'Țeavă rotundă Ø48.3x3mm',
    description: 'Țeavă rotundă sudată conform EN 10219',
    standards: ['EN 10219'],
    grade: 'S235JRH',
    dimensions: {
      diameter: 48.3,
      thickness: 3,
      weightPerM: 3.32,
    },
    lengthOptionsM: [6, 12],
    baseUnit: 'm',
    indicativePrice: {
      currency: 'RON',
      unit: 'm',
      min: 11,
      max: 14,
    },
    densityKgPerM3: 7850,
    sectionProps: {
      linearMassKgPerM: 3.32,
    },
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [3, 5],
      feeBand: '50-100 RON',
    },
    isActive: true,
  },
];

// =====================================================
// PRODUCTS - FASTENERS
// =====================================================

export const fastenerProducts: Product[] = [
  {
    id: 'prod-bolt-m10x40-88',
    slug: 'bolt-m10x40-class-8-8',
    sku: 'BOLT-M10x40-8.8',
    family: 'fasteners',
    categoryId: 'cat-fasteners',
    title: 'Șurub M10x40 clasa 8.8 zincat',
    description: 'Șurub cap hexagonal conform DIN 933',
    standards: ['DIN 933', 'ISO 4017'],
    grade: 'Clasa 8.8',
    dimensions: {
      diameter: 10,
      length: 40,
      threadLength: 26,
    },
    baseUnit: 'pcs',
    indicativePrice: {
      currency: 'RON',
      unit: 'pcs',
      min: 0.45,
      max: 0.65,
    },
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [1, 3],
      feeBand: '30-50 RON',
    },
    isActive: true,
  },
  {
    id: 'prod-nut-m10-8',
    slug: 'nut-m10-class-8',
    sku: 'NUT-M10-8',
    family: 'fasteners',
    categoryId: 'cat-fasteners',
    title: 'Piuliță M10 clasa 8 zincată',
    description: 'Piuliță hexagonală conform DIN 934',
    standards: ['DIN 934', 'ISO 4032'],
    grade: 'Clasa 8',
    dimensions: {
      diameter: 10,
      height: 8,
    },
    baseUnit: 'pcs',
    indicativePrice: {
      currency: 'RON',
      unit: 'pcs',
      min: 0.15,
      max: 0.25,
    },
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [1, 3],
      feeBand: '30-50 RON',
    },
    isActive: true,
  },
];

// =====================================================
// PRODUCTS - STAINLESS STEEL
// =====================================================

export const stainlessProducts: Product[] = [
  {
    id: 'prod-plate-304-2mm',
    slug: 'plate-stainless-304-2mm',
    sku: 'PLT-304-2',
    family: 'stainless',
    categoryId: 'cat-stainless',
    title: 'Tablă inox AISI 304 2mm',
    description: 'Tablă oțel inoxidabil 2mm finisaj 2B',
    standards: ['EN 10088-2', 'ASTM A240'],
    grade: 'AISI 304 (1.4301)',
    dimensions: {
      thickness: 2,
      widthMm: 1250,
      lengthMm: 2500,
      weightPerM2: 15.7,
    },
    baseUnit: 'kg',
    indicativePrice: {
      currency: 'RON',
      unit: 'kg',
      min: 28,
      max: 35,
    },
    densityKgPerM3: 7850,
    availability: 'on_order',
    deliveryEstimate: {
      windowDays: [7, 10],
      feeBand: '150-250 RON',
    },
    isActive: true,
  },
  {
    id: 'prod-pipe-304-50x2',
    slug: 'pipe-stainless-304-50x2',
    sku: 'PIPE-304-50x2',
    family: 'stainless',
    categoryId: 'cat-stainless',
    title: 'Țeavă inox AISI 304 Ø50x2mm',
    description: 'Țeavă rotundă oțel inoxidabil',
    standards: ['EN 10217-7'],
    grade: 'AISI 304 (1.4301)',
    dimensions: {
      diameter: 50,
      thickness: 2,
      weightPerM: 2.89,
    },
    lengthOptionsM: [6],
    baseUnit: 'm',
    indicativePrice: {
      currency: 'RON',
      unit: 'm',
      min: 85,
      max: 105,
    },
    densityKgPerM3: 7850,
    sectionProps: {
      linearMassKgPerM: 2.89,
    },
    availability: 'on_order',
    deliveryEstimate: {
      windowDays: [7, 10],
      feeBand: '100-150 RON',
    },
    isActive: true,
  },
];

// =====================================================
// PRODUCTS - NON-FERROUS
// =====================================================

export const nonferrousProducts: Product[] = [
  {
    id: 'prod-aluminum-6060-30x30x2',
    slug: 'aluminum-profile-6060-30x30x2',
    sku: 'ALU-6060-30x30x2',
    family: 'nonferrous',
    categoryId: 'cat-nonferrous',
    title: 'Profil aluminiu 6060 30x30x2mm',
    description: 'Profil pătrată aluminiu',
    standards: ['EN 755-9'],
    grade: 'Al 6060 T66',
    dimensions: {
      height: 30,
      width: 30,
      thickness: 2,
      weightPerM: 0.52,
    },
    lengthOptionsM: [6],
    baseUnit: 'm',
    indicativePrice: {
      currency: 'RON',
      unit: 'm',
      min: 18,
      max: 24,
    },
    densityKgPerM3: 2700,
    sectionProps: {
      linearMassKgPerM: 0.52,
    },
    availability: 'in_stock',
    deliveryEstimate: {
      windowDays: [5, 7],
      feeBand: '50-100 RON',
    },
    isActive: true,
  },
];

// =====================================================
// ALL PRODUCTS COMBINED
// =====================================================

export const allProducts: Product[] = [
  ...profileProducts,
  ...plateProducts,
  ...pipeProducts,
  ...fastenerProducts,
  ...stainlessProducts,
  ...nonferrousProducts,
];

// =====================================================
// HELPER FUNCTIONS
// =====================================================

export const getProductsByFamily = (family: string): Product[] => {
  return allProducts.filter(p => p.family === family && p.isActive);
};

export const getProductById = (id: string): Product | undefined => {
  return allProducts.find(p => p.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return allProducts.find(p => p.slug === slug);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return categories.find(c => c.slug === slug);
};
