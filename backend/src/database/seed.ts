import { NestFactory } from '@nestjs/core';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { AppModule } from '../app.module';
import { hashPassword } from '../modules/auth/utils/password.util';
import { Admin } from '../entities/admin.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { ProductImage } from '../entities/product-image.entity';
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
    name: 'Seasonal Fruits',
    slug: 'seasonal-fruits',
    description: 'Fresh seasonal fruits picked exclusively for you.',
    imageUrl:
      'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=1200&q=80',
    isActive: true,
    sortOrder: 2,
  },
];

const seedProducts: SeedProduct[] = [
  {
    name: 'Premium Himsagar',
    slug: 'premium-himsagar',
    shortDescription: 'Sweet, fibre-less, and incredibly juicy Himsagar mangoes.',
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
    categorySlug: 'rajshahi-mangoes',
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

const seedSiteSettings: SeedSiteSetting[] = [
  {
    key: 'hero_title',
    value: 'Welcome to FreshBitan',
    description: 'Homepage Hero Title',
    label: 'Hero Title',
    type: 'text',
    isPublic: true,
  },
  {
    key: 'hero_subtitle',
    value: 'Farm-fresh Rajshahi mangoes delivered across Bangladesh.',
    description: 'Homepage Hero Subtitle',
    label: 'Hero Subtitle',
    type: 'text',
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

    await dataSource.transaction(async (entityManager: EntityManager) => {
      const adminRepo = entityManager.getRepository(Admin);
      const categoryRepo = entityManager.getRepository(Category);
      const productRepo = entityManager.getRepository(Product);
      const productImageRepo = entityManager.getRepository(ProductImage);
      const reviewRepo = entityManager.getRepository(Review);
      const siteSettingRepo = entityManager.getRepository(SiteSetting);

      await upsertAdmin(adminRepo);
      const categoriesBySlug = await upsertCategories(categoryRepo);
      const seededProductsCount = await upsertProducts(
        productRepo,
        productImageRepo,
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

    await syncProductImages(productImageRepo, savedProduct.id, seedProduct.images);
    await upsertProductReviews(reviewRepo, savedProduct.id, seedProduct.reviews);

    seededProductsCount += 1;
  }

  return seededProductsCount;
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
