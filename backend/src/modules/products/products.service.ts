import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, Product, ProductImage } from '../../entities';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PublicProductsQueryDto } from './dto/public-products-query.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
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

    return this.findAdminById(savedProduct.id);
  }

  findAllAdmin() {
    return this.productsRepository.find({
      relations: {
        category: true,
        images: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findPublic(query: PublicProductsQueryDto) {
    const queryBuilder = this.productsRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.isActive = :isActive', { isActive: true })
      .orderBy('product.isFeatured', 'DESC')
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

    return queryBuilder.getMany();
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
        reviews: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    product.reviews = product.reviews.filter((review) => review.isApproved);

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findEntityByIdOrFail(id);

    if (updateProductDto.slug || updateProductDto.sku !== undefined) {
      await this.ensureUniqueProductFields(
        updateProductDto.slug ?? product.slug,
        updateProductDto.sku === undefined ? product.sku : updateProductDto.sku,
        product.id,
      );
    }

    await this.ensureCategoryExists(updateProductDto.categoryId);

    Object.assign(product, {
      ...updateProductDto,
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

    if (updateProductDto.images) {
      await this.replaceProductImages(product.id, updateProductDto.images);
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
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    return product;
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
}
