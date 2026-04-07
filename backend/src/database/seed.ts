import { NestFactory } from '@nestjs/core';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { hashPassword } from '../modules/auth/utils/password.util';
import { Admin } from '../entities/admin.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';
import { ProductOption } from '../entities/product-option.entity';
import { Review } from '../entities/review.entity';
import { SiteSetting } from '../entities/site-setting.entity';

type SeedCategory = {
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive?: boolean;
  sortOrder?: number;
};

type SeedProductImage = {
  imageUrl: string;
  altText?: string | null;
  isPrimary?: boolean;
  sortOrder?: number;
};

type SeedReview = {
  customerName: string;
  customerEmail: string;
  rating: number;
  comment?: string | null;
  isApproved?: boolean;
};

type SeedProductOption = {
  label: string;
  price: number;
  discountedPrice?: number | null;
  stockQuantity: number;
  sortOrder?: number;
  isDefault?: boolean;
  isActive?: boolean;
};

type SeedProduct = {
  name: string;
  slug: string;
  shortDescription?: string | null;
  description?: string | null;
  price: number;
  discountedPrice?: number | null;
  sku?: string | null;
  stockQuantity: number;
  unit?: string;
  origin?: string | null;
  isFeatured?: boolean;
  isActive?: boolean;
  categorySlug: string;
  options: SeedProductOption[];
  images: SeedProductImage[];
  reviews: SeedReview[];
};

type SeedSiteSetting = {
  key: string;
  value?: string | null;
  type?: string;
  label?: string | null;
  description?: string | null;
  isPublic?: boolean;
};

type SeedAdmin = {
  name: string;
  email: string;
  password: string;
  phone?: string | null;
  isActive?: boolean;
};

const seedCategories: SeedCategory[] = [
  {
    name: 'Rajshahi Mangoes',
    slug: 'rajshahi-mangoes',
    description: 'The finest organic mangoes directly from Rajshahi orchards.',
    imageUrl:
      'https://images.unsplash.com/photo-1519096845289-95806ee03a1a?w=1200&q=80',
    isActive: true,
    sortOrder: 1,
  },
  {
    name: 'Mango Gift Packs',
    slug: 'mango-gift-packs',
    description:
      'Curated mango pack sizes for gifting, families, and bulk household orders.',
    imageUrl:
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1200&q=80',
    isActive: true,
    sortOrder: 2,
  },
  {
    name: 'Premium Seasonal Mangoes',
    slug: 'premium-seasonal-mangoes',
    description: 'Top seasonal mango selections for premium retail orders.',
    imageUrl:
      'https://images.unsplash.com/photo-1623935397985-95f2d1f5c42d?w=1200&q=80',
    isActive: true,
    sortOrder: 3,
  },
  {
    name: 'Family Value Packs',
    slug: 'family-value-packs',
    description:
      'Larger household-friendly fruit packs at practical price points.',
    imageUrl:
      'https://images.unsplash.com/photo-1574226516831-e1dff420e37f?w=1200&q=80',
    isActive: true,
    sortOrder: 4,
  },
  {
    name: 'Mixed Fruit Boxes',
    slug: 'mixed-fruit-boxes',
    description:
      'Mixed seasonal fruit boxes for families, offices, and gifting.',
    imageUrl:
      'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=1200&q=80',
    isActive: true,
    sortOrder: 5,
  },
  {
    name: 'Organic Citrus',
    slug: 'organic-citrus',
    description:
      'Fresh citrus fruits including orange, malta, lemon, and pomelo.',
    imageUrl:
      'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=1200&q=80',
    isActive: true,
    sortOrder: 6,
  },
  {
    name: 'Banana And Tropical Picks',
    slug: 'banana-and-tropical-picks',
    description:
      'Bananas, pineapple, papaya, guava, and other everyday tropical favorites.',
    imageUrl:
      'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=1200&q=80',
    isActive: true,
    sortOrder: 7,
  },
];

const seedProductsBase: SeedProduct[] = [
  {
    name: 'Premium Himsagar',
    slug: 'premium-himsagar',
    shortDescription:
      'Sweet, fibre-less, and incredibly juicy Himsagar mangoes.',
    description:
      'Considered the king of mangoes in Bangladesh. Sourced directly from our premium partner orchards ensuring chemical-free ripening.',
    price: 1500,
    discountedPrice: 1350,
    sku: 'HIM-001',
    stockQuantity: 50,
    unit: 'kg',
    origin: 'Rajshahi',
    isFeatured: true,
    isActive: true,
    categorySlug: 'rajshahi-mangoes',
    options: [
      {
        label: '1 kg',
        price: 1500,
        discountedPrice: 1350,
        stockQuantity: 15,
        sortOrder: 0,
        isDefault: true,
        isActive: true,
      },
      {
        label: '5 kg',
        price: 7200,
        discountedPrice: 6750,
        stockQuantity: 10,
        sortOrder: 1,
        isActive: true,
      },
      {
        label: '10 kg',
        price: 14200,
        discountedPrice: 13250,
        stockQuantity: 5,
        sortOrder: 2,
        isActive: true,
      },
    ],
    images: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=800&q=80',
        altText: 'Premium Himsagar mangoes arranged in a basket.',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    reviews: [
      {
        customerName: 'Zahid Hasan',
        customerEmail: 'zahid.himsagar@example.com',
        rating: 5,
        comment:
          'Absolutely phenomenal. The Himsagar was perfectly ripened and sweet.',
        isApproved: true,
      },
      {
        customerName: 'Samiha Rahman',
        customerEmail: 'samiha.himsagar@example.com',
        rating: 4,
        comment: 'Great quality, but delivery took a bit longer than expected.',
        isApproved: true,
      },
    ],
  },
  {
    name: 'Fazli Special',
    slug: 'fazli-special',
    shortDescription: 'Large and pulpy Fazli mangoes.',
    description:
      'Late season premium Fazli, celebrated for its massive size and distinct aroma.',
    price: 1200,
    sku: 'FAZ-002',
    stockQuantity: 100,
    unit: 'kg',
    origin: 'Chapainawabganj',
    isFeatured: true,
    isActive: true,
    categorySlug: 'mango-gift-packs',
    options: [
      {
        label: '5 kg',
        price: 1200,
        stockQuantity: 25,
        sortOrder: 0,
        isDefault: true,
        isActive: true,
      },
      {
        label: '10 kg',
        price: 2300,
        stockQuantity: 18,
        sortOrder: 1,
        isActive: true,
      },
      {
        label: '1 box',
        price: 4400,
        stockQuantity: 8,
        sortOrder: 2,
        isActive: true,
      },
    ],
    images: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&q=80',
        altText: 'Fresh Fazli mangoes ready for delivery.',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    reviews: [],
  },
  {
    name: 'Langra Export Quality',
    slug: 'langra-export-quality',
    shortDescription: 'The perfect balance of sweetness and tang.',
    description:
      'Hand-picked Langra, famous for its thin skin and exceptionally sweet flesh.',
    price: 1400,
    sku: 'LAN-003',
    stockQuantity: 70,
    unit: 'kg',
    origin: 'Rajshahi',
    isFeatured: true,
    isActive: true,
    categorySlug: 'rajshahi-mangoes',
    options: [
      {
        label: '1 kg',
        price: 1400,
        stockQuantity: 20,
        sortOrder: 0,
        isDefault: true,
        isActive: true,
      },
      {
        label: '5 kg',
        price: 6800,
        discountedPrice: 6400,
        stockQuantity: 10,
        sortOrder: 1,
        isActive: true,
      },
      {
        label: '20 kg',
        price: 25800,
        discountedPrice: 24400,
        stockQuantity: 3,
        sortOrder: 2,
        isActive: true,
      },
    ],
    images: [
      {
        imageUrl:
          'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80',
        altText: 'Premium Langra mangoes close up.',
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    reviews: [
      {
        customerName: 'Ahsanullah',
        customerEmail: 'ahsanullah.langra@example.com',
        rating: 5,
        comment:
          'The Langra was exactly like the ones I had in my childhood. Superb!',
        isApproved: true,
      },
    ],
  },
];

type ProductBlueprint = {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  basePrice: number;
  discountedPrice?: number | null;
  origin: string;
  categorySlug: string;
  unit?: string;
  imageUrl: string;
  altText: string;
  isFeatured?: boolean;
};

const productBlueprints: ProductBlueprint[] = [
  {
    name: 'Amrapali Premium',
    slug: 'amrapali-premium',
    shortDescription: 'Compact, sweet, and aromatic Amrapali mangoes.',
    description:
      'A favorite for customers who love rich sweetness and smooth texture in a smaller mango format.',
    basePrice: 1280,
    discountedPrice: 1190,
    origin: 'Rajshahi',
    categorySlug: 'premium-seasonal-mangoes',
    imageUrl:
      'https://images.unsplash.com/photo-1621947081720-86970823b77a?w=800&q=80',
    altText: 'Fresh Amrapali mangoes in a wooden tray.',
    isFeatured: true,
  },
  {
    name: 'Gopalbhog Classic',
    slug: 'gopalbhog-classic',
    shortDescription:
      'Soft, fragrant Gopalbhog mangoes for early season buyers.',
    description:
      'A classic early-season mango with a pleasant aroma and dependable sweetness.',
    basePrice: 1180,
    discountedPrice: 1090,
    origin: 'Rajshahi',
    categorySlug: 'premium-seasonal-mangoes',
    imageUrl:
      'https://images.unsplash.com/photo-1605027990121-cbae9e0642df?w=800&q=80',
    altText: 'Gopalbhog mangoes ready for packing.',
  },
  {
    name: 'Haribhanga Special',
    slug: 'haribhanga-special',
    shortDescription: 'Northern Bangladesh Haribhanga with bold sweetness.',
    description:
      'Popular for gifting and family tables thanks to its juicy bite and vibrant color.',
    basePrice: 1160,
    discountedPrice: 1060,
    origin: 'Rangpur',
    categorySlug: 'premium-seasonal-mangoes',
    imageUrl:
      'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&q=80',
    altText: 'Haribhanga mangoes arranged in market baskets.',
  },
  {
    name: 'Khirsapat Orchard Select',
    slug: 'khirsapat-orchard-select',
    shortDescription: 'Smooth and fragrant Khirsapat for premium buyers.',
    description:
      'Curated from trusted orchards with excellent flesh quality and refined sweetness.',
    basePrice: 1450,
    discountedPrice: 1340,
    origin: 'Chapainawabganj',
    categorySlug: 'rajshahi-mangoes',
    imageUrl:
      'https://images.unsplash.com/photo-1603046891744-76e6300f1f64?w=800&q=80',
    altText: 'Premium Khirsapat mangoes on a table.',
  },
  {
    name: 'Ashwina Late Season',
    slug: 'ashwina-late-season',
    shortDescription: 'Late-season mango pick with balanced sweetness.',
    description:
      'A dependable variety for customers looking for mangoes later in the season.',
    basePrice: 980,
    discountedPrice: 910,
    origin: 'Naogaon',
    categorySlug: 'family-value-packs',
    imageUrl:
      'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=800&q=80',
    altText: 'Ashwina mangoes stacked in a crate.',
  },
  {
    name: 'Bari Mango Combo',
    slug: 'bari-mango-combo',
    shortDescription: 'Reliable mixed mango variety pack for household orders.',
    description:
      'A practical family pick featuring assorted mangoes for everyday enjoyment.',
    basePrice: 1080,
    discountedPrice: 995,
    origin: 'Rajshahi',
    categorySlug: 'family-value-packs',
    imageUrl:
      'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?w=800&q=80',
    altText: 'Mixed mango combo arranged for sale.',
  },
  {
    name: 'Office Mango Gift Box',
    slug: 'office-mango-gift-box',
    shortDescription:
      'Gift-ready mango box with estimated 4-5 kg and around 12-16 mangoes.',
    description:
      'Designed for neat presentation and premium fruit selection in a convenient box format. A standard box usually carries around 4-5 kg mangoes, approximately 12-16 pieces depending on variety and fruit size.',
    basePrice: 2500,
    discountedPrice: 2350,
    origin: 'Rajshahi',
    categorySlug: 'mango-gift-packs',
    unit: 'box',
    imageUrl:
      'https://images.unsplash.com/photo-1528825871115-3581a5387919?w=800&q=80',
    altText: 'Gift-ready mango box with premium fruit.',
    isFeatured: true,
  },
  {
    name: 'Family Mango Basket',
    slug: 'family-mango-basket',
    shortDescription:
      'Large curated basket with estimated 6-7 kg and around 18-22 mangoes.',
    description:
      'A generous basket option suitable for bigger households and weekend sharing. The standard basket is planned around 6-7 kg fruit weight and roughly 18-22 mangoes based on season and grading.',
    basePrice: 3200,
    discountedPrice: 2990,
    origin: 'Chapainawabganj',
    categorySlug: 'mango-gift-packs',
    unit: 'basket',
    imageUrl:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    altText: 'Large basket filled with mangoes.',
  },
  {
    name: 'Orange Premium Pack',
    slug: 'orange-premium-pack',
    shortDescription: 'Juicy oranges selected for sweetness and color.',
    description:
      'Carefully selected oranges suited for breakfast tables and family fruit bowls.',
    basePrice: 620,
    discountedPrice: 570,
    origin: 'Sylhet',
    categorySlug: 'organic-citrus',
    imageUrl:
      'https://images.unsplash.com/photo-1547514701-42782101795e?w=800&q=80',
    altText: 'Bright oranges stacked together.',
  },
  {
    name: 'Malta Fresh Harvest',
    slug: 'malta-fresh-harvest',
    shortDescription: 'Locally loved malta with refreshing sweetness.',
    description:
      'A citrus favorite for juice, snacking, and everyday fruit orders.',
    basePrice: 680,
    discountedPrice: 630,
    origin: 'Narsingdi',
    categorySlug: 'organic-citrus',
    imageUrl:
      'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=800&q=80',
    altText: 'Fresh malta fruit displayed in a bowl.',
  },
  {
    name: 'Lemon Kitchen Pack',
    slug: 'lemon-kitchen-pack',
    shortDescription: 'Everyday lemon pack for kitchen use.',
    description:
      'Useful for households needing fresh lemon for drinks, cooking, and salad.',
    basePrice: 220,
    discountedPrice: 199,
    origin: 'Sylhet',
    categorySlug: 'organic-citrus',
    imageUrl:
      'https://images.unsplash.com/photo-1590502593747-42a996133562?w=800&q=80',
    altText: 'Fresh lemons close-up on a table.',
  },
  {
    name: 'Pomelo Select',
    slug: 'pomelo-select',
    shortDescription: 'Large pomelo fruit with refreshing citrus flavor.',
    description:
      'A bigger citrus choice for families who enjoy lightly sweet fruit with a clean finish.',
    basePrice: 290,
    discountedPrice: 260,
    origin: 'Jhalokati',
    categorySlug: 'organic-citrus',
    unit: 'piece',
    imageUrl:
      'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=800&q=80',
    altText: 'Pomelo fruits ready for sale.',
  },
  {
    name: 'Banana Bunch Premium',
    slug: 'banana-bunch-premium',
    shortDescription: 'Fresh banana bunch for daily fruit needs.',
    description:
      'Popular for breakfast, kids, and everyday snacking with dependable quality.',
    basePrice: 180,
    discountedPrice: 165,
    origin: 'Jashore',
    categorySlug: 'banana-and-tropical-picks',
    unit: 'dozen',
    imageUrl:
      'https://images.unsplash.com/photo-1574226516831-e1dff420e37f?w=800&q=80',
    altText: 'Fresh banana bunches lined up.',
  },
  {
    name: 'Pineapple Sweet Core',
    slug: 'pineapple-sweet-core',
    shortDescription: 'Sweet pineapple with a bright tropical finish.',
    description:
      'A crowd-pleasing tropical fruit suitable for slicing, juice, and dessert use.',
    basePrice: 160,
    discountedPrice: 145,
    origin: 'Madhupur',
    categorySlug: 'banana-and-tropical-picks',
    unit: 'piece',
    imageUrl:
      'https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=800&q=80',
    altText: 'Fresh pineapple displayed upright.',
  },
  {
    name: 'Papaya Nutrition Pack',
    slug: 'papaya-nutrition-pack',
    shortDescription: 'Ripe papaya selected for sweetness and texture.',
    description:
      'A practical health-focused choice with soft texture and easy serving.',
    basePrice: 140,
    discountedPrice: 125,
    origin: 'Cumilla',
    categorySlug: 'banana-and-tropical-picks',
    unit: 'piece',
    imageUrl:
      'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=800&q=80',
    altText: 'Fresh papaya fruit on display.',
  },
  {
    name: 'Guava Crunch Box',
    slug: 'guava-crunch-box',
    shortDescription: 'Firm, crunchy guava picked for freshness.',
    description:
      'Great for salt-and-chili snacks, fruit platters, and family sharing.',
    basePrice: 260,
    discountedPrice: 235,
    origin: 'Barishal',
    categorySlug: 'banana-and-tropical-picks',
    imageUrl:
      'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&q=80',
    altText: 'Fresh guava arranged in rows.',
  },
  {
    name: 'Dragon Fruit Box',
    slug: 'dragon-fruit-box',
    shortDescription: 'Bright dragon fruit for premium mixed orders.',
    description:
      'A visually striking fruit choice with light sweetness and a clean finish.',
    basePrice: 520,
    discountedPrice: 480,
    origin: 'Chattogram',
    categorySlug: 'mixed-fruit-boxes',
    imageUrl:
      'https://images.unsplash.com/photo-1527325678964-54921661f888?w=800&q=80',
    altText: 'Dragon fruit in a premium box.',
  },
  {
    name: 'Seasonal Mixed Fruit Crate',
    slug: 'seasonal-mixed-fruit-crate',
    shortDescription:
      'Assorted seasonal fruits in a crate with estimated 8-10 kg total weight.',
    description:
      'A mixed crate for households that want variety instead of a single-fruit order. One standard crate usually carries around 8-10 kg assorted fruits depending on current seasonal availability.',
    basePrice: 1850,
    discountedPrice: 1720,
    origin: 'Bangladesh',
    categorySlug: 'mixed-fruit-boxes',
    unit: 'crate',
    imageUrl:
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&q=80',
    altText: 'Mixed fruit crate with seasonal produce.',
    isFeatured: true,
  },
  {
    name: 'Weekend Family Fruit Box',
    slug: 'weekend-family-fruit-box',
    shortDescription:
      'Mixed fruit box for weekly use with estimated 4-5 kg total fruit.',
    description:
      'Includes a practical combination of fruits for family snacking across the week. One box generally holds around 4-5 kg fruit with quantities varying by season and fruit type.',
    basePrice: 1450,
    discountedPrice: 1340,
    origin: 'Bangladesh',
    categorySlug: 'mixed-fruit-boxes',
    unit: 'box',
    imageUrl:
      'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=800&q=80',
    altText: 'Family fruit box with mixed produce.',
  },
];

const buildStandardOptions = (
  basePrice: number,
  discountedPrice?: number | null,
  unit = 'kg',
): SeedProductOption[] => {
  if (unit === 'piece') {
    return [
      {
        label: '1 piece',
        price: basePrice,
        discountedPrice: discountedPrice ?? undefined,
        stockQuantity: 30,
        sortOrder: 0,
        isDefault: true,
        isActive: true,
      },
      {
        label: '3 pieces',
        price: Math.round(basePrice * 2.8),
        discountedPrice:
          discountedPrice !== undefined && discountedPrice !== null
            ? Math.round(discountedPrice * 2.7)
            : undefined,
        stockQuantity: 20,
        sortOrder: 1,
        isActive: true,
      },
    ];
  }

  if (
    unit === 'box' ||
    unit === 'basket' ||
    unit === 'crate' ||
    unit === 'dozen'
  ) {
    const packLabels =
      unit === 'box'
        ? [
            '1 box | est. 4-5 kg | approx. 12-16 pcs',
            '2 boxes | est. 8-10 kg | approx. 24-32 pcs',
          ]
        : unit === 'basket'
          ? [
              '1 basket | est. 6-7 kg | approx. 18-22 pcs',
              '2 baskets | est. 12-14 kg | approx. 36-44 pcs',
            ]
          : unit === 'crate'
            ? [
                '1 crate | est. 8-10 kg | assorted fruits',
                '2 crates | est. 16-20 kg | assorted fruits',
              ]
            : [
                '1 dozen | 12 pcs | est. 1.4-1.8 kg',
                '2 dozens | 24 pcs | est. 2.8-3.6 kg',
              ];

    return [
      {
        label: packLabels[0],
        price: basePrice,
        discountedPrice: discountedPrice ?? undefined,
        stockQuantity: 20,
        sortOrder: 0,
        isDefault: true,
        isActive: true,
      },
      {
        label: packLabels[1],
        price: Math.round(basePrice * 1.92),
        discountedPrice:
          discountedPrice !== undefined && discountedPrice !== null
            ? Math.round(discountedPrice * 1.88)
            : undefined,
        stockQuantity: 12,
        sortOrder: 1,
        isActive: true,
      },
    ];
  }

  return [
    {
      label: `1 ${unit}`,
      price: basePrice,
      discountedPrice: discountedPrice ?? undefined,
      stockQuantity: 24,
      sortOrder: 0,
      isDefault: true,
      isActive: true,
    },
    {
      label: `3 ${unit}`,
      price: Math.round(basePrice * 2.9),
      discountedPrice:
        discountedPrice !== undefined && discountedPrice !== null
          ? Math.round(discountedPrice * 2.8)
          : undefined,
      stockQuantity: 16,
      sortOrder: 1,
      isActive: true,
    },
    {
      label: `5 ${unit}`,
      price: Math.round(basePrice * 4.75),
      discountedPrice:
        discountedPrice !== undefined && discountedPrice !== null
          ? Math.round(discountedPrice * 4.55)
          : undefined,
      stockQuantity: 10,
      sortOrder: 2,
      isActive: true,
    },
  ];
};

const buildSeedProduct = (
  blueprint: ProductBlueprint,
  index: number,
): SeedProduct => {
  const options = buildStandardOptions(
    blueprint.basePrice,
    blueprint.discountedPrice,
    blueprint.unit ?? 'kg',
  );
  const stockQuantity = options.reduce(
    (sum, option) => sum + option.stockQuantity,
    0,
  );

  return {
    name: blueprint.name,
    slug: blueprint.slug,
    shortDescription: blueprint.shortDescription,
    description: blueprint.description,
    price: blueprint.basePrice,
    discountedPrice: blueprint.discountedPrice ?? null,
    sku: `SKU-${String(index + 4).padStart(3, '0')}`,
    stockQuantity,
    unit: blueprint.unit ?? 'kg',
    origin: blueprint.origin,
    isFeatured: blueprint.isFeatured ?? false,
    isActive: true,
    categorySlug: blueprint.categorySlug,
    options,
    images: [
      {
        imageUrl: blueprint.imageUrl,
        altText: blueprint.altText,
        isPrimary: true,
        sortOrder: 0,
      },
    ],
    reviews: [],
  };
};

const generatedSeedProducts: SeedProduct[] = productBlueprints.flatMap(
  (blueprint, blueprintIndex) =>
    Array.from({ length: 2 }, (_, variantIndex) => {
      const suffix = variantIndex === 0 ? 'Standard' : 'Reserve';
      const slugSuffix = variantIndex === 0 ? 'standard' : 'reserve';
      const priceMultiplier = variantIndex === 0 ? 1 : 1.12;
      const discountedPrice =
        blueprint.discountedPrice !== undefined &&
        blueprint.discountedPrice !== null
          ? Math.round(blueprint.discountedPrice * priceMultiplier)
          : null;

      return buildSeedProduct(
        {
          ...blueprint,
          name: `${blueprint.name} ${suffix}`,
          slug: `${blueprint.slug}-${slugSuffix}`,
          shortDescription:
            variantIndex === 0
              ? blueprint.shortDescription
              : `${blueprint.shortDescription} Premium reserve selection.`,
          description:
            variantIndex === 0
              ? blueprint.description
              : `${blueprint.description} This reserve variant is curated for buyers who want a more premium grading and presentation.`,
          basePrice: Math.round(blueprint.basePrice * priceMultiplier),
          discountedPrice,
          isFeatured: blueprint.isFeatured ?? blueprintIndex % 5 === 0,
        },
        blueprintIndex * 2 + variantIndex,
      );
    }),
);

const seedProducts: SeedProduct[] = [
  ...seedProductsBase,
  ...generatedSeedProducts,
];

const seedSiteSettings: SeedSiteSetting[] = [
  {
    key: 'hero_title',
    value: 'Premium mangoes from trusted Bangladeshi orchards',
    description: 'Homepage Hero Title',
    label: 'Hero Title',
    type: 'text',
    isPublic: true,
  },
  {
    key: 'hero_subtitle',
    value:
      'FreshBitan brings orchard-to-home mango packs across Bangladesh with simple manual ordering.',
    description: 'Homepage Hero Subtitle',
    label: 'Hero Subtitle',
    type: 'text',
    isPublic: true,
  },
  {
    key: 'facebook_url',
    value: 'https://www.facebook.com/freshbitan',
    description: 'Public Facebook page link',
    label: 'Facebook URL',
    type: 'url',
    isPublic: true,
  },
];

const seedAdmin: SeedAdmin = {
  name: 'FreshBitan Admin',
  email: 'admin@gmail.com',
  password: '13663',
  phone: null,
  isActive: true,
};

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  console.log('Seeding demo data...');

  try {
    const dataSource = app.get(DataSource);

    console.log('Ensuring database schema is up to date for seed data...');
    await dataSource.synchronize();

    await dataSource.transaction(async (entityManager: EntityManager) => {
      const adminRepo = entityManager.getRepository(Admin);
      const categoryRepo = entityManager.getRepository(Category);
      const productRepo = entityManager.getRepository(Product);
      const productImageRepo = entityManager.getRepository(ProductImage);
      const productOptionRepo = entityManager.getRepository(ProductOption);
      const reviewRepo = entityManager.getRepository(Review);
      const siteSettingRepo = entityManager.getRepository(SiteSetting);

      await upsertAdmin(adminRepo);
      const categoriesBySlug = await upsertCategories(categoryRepo);
      const seededProductsCount = await upsertProducts(
        productRepo,
        productImageRepo,
        productOptionRepo,
        reviewRepo,
        categoriesBySlug,
      );
      await upsertSiteSettings(siteSettingRepo);

      console.log(
        `Seed data successful! Admin ready and ${seededProductsCount} products ready.`,
      );
    });
  } catch (error) {
    console.error('Error seeding data: ', error);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

async function upsertAdmin(adminRepo: Repository<Admin>) {
  const existingAdmin = await adminRepo.findOne({
    where: { email: seedAdmin.email },
  });

  const admin = adminRepo.create({
    ...(existingAdmin ?? {}),
    name: seedAdmin.name,
    email: seedAdmin.email,
    passwordHash: await hashPassword(seedAdmin.password),
    phone: seedAdmin.phone ?? null,
    isActive: seedAdmin.isActive ?? true,
  });

  await adminRepo.save(admin);
}

async function upsertCategories(categoryRepo: Repository<Category>) {
  const categoriesBySlug = new Map<string, Category>();

  for (const seedCategory of seedCategories) {
    const existingCategory = await categoryRepo.findOne({
      where: { slug: seedCategory.slug },
    });

    const category = categoryRepo.create({
      ...(existingCategory ?? {}),
      ...seedCategory,
      description: seedCategory.description ?? null,
      imageUrl: seedCategory.imageUrl ?? null,
      isActive: seedCategory.isActive ?? true,
      sortOrder: seedCategory.sortOrder ?? 0,
    });

    const savedCategory = await categoryRepo.save(category);
    categoriesBySlug.set(savedCategory.slug, savedCategory);
  }

  return categoriesBySlug;
}

async function upsertProducts(
  productRepo: Repository<Product>,
  productImageRepo: Repository<ProductImage>,
  productOptionRepo: Repository<ProductOption>,
  reviewRepo: Repository<Review>,
  categoriesBySlug: Map<string, Category>,
) {
  let seededProductsCount = 0;

  for (const seedProduct of seedProducts) {
    const category = categoriesBySlug.get(seedProduct.categorySlug);

    if (!category) {
      throw new Error(
        `Seed category "${seedProduct.categorySlug}" was not created successfully.`,
      );
    }

    const existingProduct = await productRepo.findOne({
      where: { slug: seedProduct.slug },
    });

    const product = productRepo.create({
      ...(existingProduct ?? {}),
      name: seedProduct.name,
      slug: seedProduct.slug,
      shortDescription: seedProduct.shortDescription ?? null,
      description: seedProduct.description ?? null,
      price: seedProduct.price,
      discountedPrice: seedProduct.discountedPrice ?? null,
      sku: seedProduct.sku ?? null,
      stockQuantity: seedProduct.stockQuantity,
      unit: seedProduct.unit ?? 'kg',
      origin: seedProduct.origin ?? null,
      isFeatured: seedProduct.isFeatured ?? false,
      isActive: seedProduct.isActive ?? true,
      categoryId: category.id,
    });

    const savedProduct = await productRepo.save(product);

    await syncProductImages(
      productImageRepo,
      savedProduct.id,
      seedProduct.images,
    );
    await syncProductOptions(
      productOptionRepo,
      savedProduct.id,
      seedProduct.options,
    );
    await upsertProductReviews(
      reviewRepo,
      savedProduct.id,
      seedProduct.reviews,
    );

    seededProductsCount += 1;
  }

  return seededProductsCount;
}

async function syncProductOptions(
  productOptionRepo: Repository<ProductOption>,
  productId: string,
  seedOptions: SeedProductOption[],
) {
  const existingOptions = await productOptionRepo.find({
    where: { productId },
  });
  if (existingOptions.length > 0) {
    await productOptionRepo.remove(existingOptions);
  }

  if (seedOptions.length === 0) {
    return;
  }

  await productOptionRepo.save(
    seedOptions.map((option, index) =>
      productOptionRepo.create({
        productId,
        label: option.label,
        price: option.price,
        discountedPrice: option.discountedPrice ?? null,
        stockQuantity: option.stockQuantity,
        sortOrder: option.sortOrder ?? index,
        isDefault: option.isDefault ?? index === 0,
        isActive: option.isActive ?? true,
      }),
    ),
  );
}

async function syncProductImages(
  productImageRepo: Repository<ProductImage>,
  productId: string,
  seedImages: SeedProductImage[],
) {
  const existingImages = await productImageRepo.find({
    where: { productId },
  });
  const existingImagesByUrl = new Map(
    existingImages.map((image) => [image.imageUrl, image]),
  );
  const seedImageUrls = new Set(seedImages.map((image) => image.imageUrl));
  const imagesToRemove = existingImages.filter(
    (image) => !seedImageUrls.has(image.imageUrl),
  );

  if (imagesToRemove.length > 0) {
    await productImageRepo.remove(imagesToRemove);
  }

  const imagesToSave = seedImages.map((image, index) =>
    productImageRepo.create({
      ...(existingImagesByUrl.get(image.imageUrl) ?? {}),
      productId,
      imageUrl: image.imageUrl,
      altText: image.altText ?? null,
      isPrimary: image.isPrimary ?? index === 0,
      sortOrder: image.sortOrder ?? index,
    }),
  );

  if (imagesToSave.length > 0) {
    await productImageRepo.save(imagesToSave);
  }
}

async function upsertProductReviews(
  reviewRepo: Repository<Review>,
  productId: string,
  seedReviewsForProduct: SeedReview[],
) {
  for (const seedReview of seedReviewsForProduct) {
    const existingReview = await reviewRepo.findOne({
      where: {
        productId,
        customerEmail: seedReview.customerEmail,
      },
    });

    const review = reviewRepo.create({
      ...(existingReview ?? {}),
      productId,
      customerName: seedReview.customerName,
      customerEmail: seedReview.customerEmail,
      rating: seedReview.rating,
      comment: seedReview.comment ?? null,
      isApproved: seedReview.isApproved ?? true,
    });

    await reviewRepo.save(review);
  }
}

async function upsertSiteSettings(siteSettingRepo: Repository<SiteSetting>) {
  for (const seedSiteSetting of seedSiteSettings) {
    const existingSiteSetting = await siteSettingRepo.findOne({
      where: { key: seedSiteSetting.key },
    });

    const siteSetting = siteSettingRepo.create({
      ...(existingSiteSetting ?? {}),
      ...seedSiteSetting,
      value: seedSiteSetting.value ?? null,
      type: seedSiteSetting.type ?? 'text',
      label: seedSiteSetting.label ?? null,
      description: seedSiteSetting.description ?? null,
      isPublic: seedSiteSetting.isPublic ?? false,
    });

    await siteSettingRepo.save(siteSetting);
  }
}

void bootstrap();
