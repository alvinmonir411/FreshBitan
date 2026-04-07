import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, Product, ProductImage, ProductOption } from '../../entities';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateProductOptionDto } from './dto/create-product-option.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PublicProductsQueryDto } from './dto/public-products-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
    @InjectRepository(ProductOption)
    private readonly productOptionsRepository: Repository<ProductOption>,
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    await this.ensureUniqueProductFields(
      createProductDto.slug,
      createProductDto.sku,
    );
    await this.ensureCategoryExists(createProductDto.categoryId);

    const product = this.productsRepository.create({
      ...createProductDto,
      shortDescription: createProductDto.shortDescription ?? null,
      description: createProductDto.description ?? null,
      discountedPrice: createProductDto.discountedPrice ?? null,
      sku: createProductDto.sku ?? null,
      unit: createProductDto.unit ?? 'kg',
      origin: createProductDto.origin ?? null,
      isFeatured: createProductDto.isFeatured ?? false,
      isActive: createProductDto.isActive ?? true,
      categoryId: createProductDto.categoryId ?? null,
    });

    const savedProduct = await this.productsRepository.save(product);
    await this.replaceProductImages(savedProduct.id, createProductDto.images);
    await this.replaceProductOptions(
      savedProduct.id,
      this.normalizeIncomingOptions(createProductDto),
    );

    return this.findAdminById(savedProduct.id);
  }

  async findAllAdmin() {
    const products = await this.productsRepository.find({
      relations: {
        category: true,
        images: true,
        options: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return products.map((product) => this.sortProductRelations(product));
  }

  async findPublic(query: PublicProductsQueryDto) {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .leftJoinAndSelect(
        'product.options',
        'options',
        'options.isActive = :optionIsActive',
        { optionIsActive: true },
      )
      .where('product.isActive = :isActive', { isActive: true })
      .orderBy('product.isFeatured', 'DESC')
      .addOrderBy('options.sortOrder', 'ASC')
      .addOrderBy('product.createdAt', 'DESC');

    if (query.categorySlug) {
      queryBuilder.andWhere('category.slug = :categorySlug', {
        categorySlug: query.categorySlug,
      });
    }

    if (query.featured !== undefined) {
      queryBuilder.andWhere('product.isFeatured = :featured', {
        featured: query.featured,
      });
    }

    const products = await queryBuilder.getMany();
    return products.map((product) => this.sortProductRelations(product));
  }

  async findPublicBySlug(slug: string) {
    const product = await this.productsRepository.findOne({
      where: {
        slug,
        isActive: true,
      },
      relations: {
        category: true,
        images: true,
        options: true,
        reviews: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    product.reviews = product.reviews.filter((review) => review.isApproved);
    product.options = product.options
      .filter((option) => option.isActive)
      .sort((first, second) => first.sortOrder - second.sortOrder);

    return this.sortProductRelations(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findEntityByIdOrFail(id);
    const { images, options, ...productFields } = updateProductDto;

    if (updateProductDto.slug || updateProductDto.sku !== undefined) {
      await this.ensureUniqueProductFields(
        updateProductDto.slug ?? product.slug,
        updateProductDto.sku === undefined ? product.sku : updateProductDto.sku,
        product.id,
      );
    }

    await this.ensureCategoryExists(updateProductDto.categoryId);

    Object.assign(product, {
      ...productFields,
      shortDescription:
        updateProductDto.shortDescription === undefined
          ? product.shortDescription
          : updateProductDto.shortDescription,
      description:
        updateProductDto.description === undefined
          ? product.description
          : updateProductDto.description,
      discountedPrice:
        updateProductDto.discountedPrice === undefined
          ? product.discountedPrice
          : updateProductDto.discountedPrice,
      sku:
        updateProductDto.sku === undefined ? product.sku : updateProductDto.sku,
      origin:
        updateProductDto.origin === undefined
          ? product.origin
          : updateProductDto.origin,
      categoryId:
        updateProductDto.categoryId === undefined
          ? product.categoryId
          : updateProductDto.categoryId,
    });

    await this.productsRepository.save(product);

    if (images) {
      await this.replaceProductImages(product.id, images);
    }

    if (options) {
      await this.replaceProductOptions(
        product.id,
        this.normalizeIncomingOptions(
          { ...(productFields as CreateProductDto), options },
          product,
        ),
      );
    }

    return this.findAdminById(product.id);
  }

  async remove(id: string) {
    const product = await this.findEntityByIdOrFail(id);

    try {
      await this.productsRepository.remove(product);
    } catch {
      throw new ConflictException(
        'Product could not be deleted because it is referenced by existing records.',
      );
    }

    return {
      message: 'Product deleted successfully.',
    };
  }

  private async findAdminById(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
      relations: {
        category: true,
        images: true,
        options: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return this.sortProductRelations(product);
  }

  private async findEntityByIdOrFail(id: string) {
    const product = await this.productsRepository.findOne({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
  }

  private async ensureCategoryExists(categoryId?: string) {
    if (!categoryId) {
      return;
    }

    const category = await this.categoriesRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }
  }

  private async ensureUniqueProductFields(
    slug: string,
    sku?: string | null,
    excludeId?: string,
  ) {
    const existingProductBySlug = await this.productsRepository.findOne({
      where: { slug },
    });

    if (existingProductBySlug && existingProductBySlug.id !== excludeId) {
      throw new ConflictException('Product slug already exists.');
    }

    if (!sku) {
      return;
    }

    const existingProductBySku = await this.productsRepository.findOne({
      where: { sku },
    });

    if (existingProductBySku && existingProductBySku.id !== excludeId) {
      throw new ConflictException('Product SKU already exists.');
    }
  }

  private async replaceProductImages(
    productId: string,
    images?: CreateProductDto['images'],
  ) {
    if (!images) {
      return;
    }

    await this.productImagesRepository.delete({ productId });

    if (images.length === 0) {
      return;
    }

    const productImages = images.map((image, index) =>
      this.productImagesRepository.create({
        productId,
        imageUrl: image.imageUrl,
        altText: image.altText ?? null,
        isPrimary: image.isPrimary ?? index === 0,
        sortOrder: image.sortOrder ?? index,
      }),
    );

    await this.productImagesRepository.save(productImages);
  }

  private normalizeIncomingOptions(
    dto: Pick<
      CreateProductDto,
      'options' | 'price' | 'discountedPrice' | 'stockQuantity' | 'unit'
    >,
    existingProduct?: Product,
  ) {
    const providedOptions = dto.options?.map((option, index) => ({
      ...option,
      label: option.label.trim(),
      sortOrder: option.sortOrder ?? index,
      discountedPrice: option.discountedPrice ?? undefined,
      isDefault: option.isDefault ?? false,
      isActive: option.isActive ?? true,
    }));

    if (providedOptions && providedOptions.length > 0) {
      return this.ensureOptionDefaults(providedOptions);
    }

    const fallbackLabel = dto.unit ?? existingProduct?.unit ?? '1 kg';
    const fallbackPrice = dto.price ?? existingProduct?.price;
    const fallbackStock = dto.stockQuantity ?? existingProduct?.stockQuantity;

    if (fallbackPrice === undefined || fallbackStock === undefined) {
      throw new BadRequestException(
        'At least one product purchase option is required.',
      );
    }

    return [
      {
        label: fallbackLabel,
        price: fallbackPrice,
        discountedPrice:
          dto.discountedPrice ?? existingProduct?.discountedPrice ?? undefined,
        stockQuantity: fallbackStock,
        sortOrder: 0,
        isDefault: true,
        isActive: true,
      },
    ];
  }

  private ensureOptionDefaults(options: Array<CreateProductOptionDto>) {
    const normalized = options.map((option, index) => ({
      ...option,
      label: option.label.trim(),
      sortOrder: option.sortOrder ?? index,
      discountedPrice: option.discountedPrice ?? undefined,
      isDefault: option.isDefault ?? false,
      isActive: option.isActive ?? true,
    }));

    const activeOptions = normalized.filter((option) => option.isActive);

    if (activeOptions.length === 0) {
      throw new BadRequestException(
        'At least one active purchase option is required.',
      );
    }

    const duplicateLabels = new Set<string>();
    const seenLabels = new Set<string>();

    for (const option of normalized) {
      const normalizedLabel = option.label.toLowerCase();

      if (seenLabels.has(normalizedLabel)) {
        duplicateLabels.add(option.label);
      }

      seenLabels.add(normalizedLabel);

      if (
        option.discountedPrice !== undefined &&
        option.discountedPrice > option.price
      ) {
        throw new BadRequestException(
          `Discounted price cannot be greater than price for ${option.label}.`,
        );
      }
    }

    if (duplicateLabels.size > 0) {
      throw new BadRequestException(
        'Purchase option labels must be unique within a product.',
      );
    }

    const defaultCount = normalized.filter(
      (option) => option.isDefault && option.isActive,
    ).length;

    if (defaultCount > 1) {
      throw new BadRequestException(
        'Only one active purchase option can be marked as default.',
      );
    }

    const explicitDefault = normalized.find(
      (option) => option.isDefault && option.isActive,
    );

    if (!explicitDefault) {
      const firstActiveIndex = normalized.findIndex(
        (option) => option.isActive,
      );
      normalized[firstActiveIndex] = {
        ...normalized[firstActiveIndex],
        isDefault: true,
      };
    }

    return normalized.map((option) => ({
      ...option,
      isDefault: option.isActive && option.isDefault,
    }));
  }

  private async replaceProductOptions(
    productId: string,
    options: Array<CreateProductOptionDto>,
  ) {
    await this.productOptionsRepository.delete({ productId });

    const savedOptions = await this.productOptionsRepository.save(
      options.map((option, index) =>
        this.productOptionsRepository.create({
          productId,
          label: option.label.trim(),
          price: option.price,
          discountedPrice: option.discountedPrice ?? null,
          stockQuantity: option.stockQuantity,
          sortOrder: option.sortOrder ?? index,
          isDefault: option.isDefault ?? false,
          isActive: option.isActive ?? true,
        }),
      ),
    );

    const representativeOption =
      savedOptions.find((option) => option.isDefault && option.isActive) ??
      savedOptions.find((option) => option.isActive) ??
      savedOptions[0];

    const totalStock = savedOptions
      .filter((option) => option.isActive)
      .reduce((sum, option) => sum + option.stockQuantity, 0);

    if (!representativeOption) {
      throw new BadRequestException(
        'Product must have at least one purchase option.',
      );
    }

    await this.productsRepository.update(productId, {
      unit: this.normalizeUnitLabel(representativeOption.label),
      price: representativeOption.price,
      discountedPrice: representativeOption.discountedPrice,
      stockQuantity: totalStock,
    });
  }

  private normalizeUnitLabel(label: string) {
    const compactLabel = label.split('|')[0]?.trim() || label.trim();

    return compactLabel.slice(0, 30);
  }

  private sortProductRelations(product: Product) {
    if (product.images) {
      product.images = [...product.images].sort(
        (first, second) => first.sortOrder - second.sortOrder,
      );
    }

    if (product.options) {
      product.options = [...product.options].sort(
        (first, second) => first.sortOrder - second.sortOrder,
      );
    }

    return product;
  }
}
