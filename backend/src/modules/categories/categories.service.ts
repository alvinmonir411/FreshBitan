import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../../entities';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    await this.ensureUniqueSlug(createCategoryDto.slug);

    const category = this.categoriesRepository.create({
      ...createCategoryDto,
      description: createCategoryDto.description ?? null,
      imageUrl: createCategoryDto.imageUrl ?? null,
      isActive: createCategoryDto.isActive ?? true,
      sortOrder: createCategoryDto.sortOrder ?? 0,
    });

    return this.categoriesRepository.save(category);
  }

  findAllAdmin() {
    return this.categoriesRepository.find({
      order: {
        sortOrder: 'ASC',
        createdAt: 'DESC',
      },
    });
  }

  findAllPublic() {
    return this.categoriesRepository.find({
      where: {
        isActive: true,
      },
      order: {
        sortOrder: 'ASC',
        name: 'ASC',
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOneOrFail(id);

    if (
      updateCategoryDto.slug &&
      updateCategoryDto.slug.toLowerCase() !== category.slug.toLowerCase()
    ) {
      await this.ensureUniqueSlug(updateCategoryDto.slug, category.id);
    }

    Object.assign(category, {
      ...updateCategoryDto,
      description:
        updateCategoryDto.description === undefined
          ? category.description
          : updateCategoryDto.description,
      imageUrl:
        updateCategoryDto.imageUrl === undefined
          ? category.imageUrl
          : updateCategoryDto.imageUrl,
    });

    return this.categoriesRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.findOneOrFail(id);
    await this.categoriesRepository.remove(category);

    return {
      message: 'Category deleted successfully.',
    };
  }

  private async findOneOrFail(id: string) {
    const category = await this.categoriesRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found.');
    }

    return category;
  }

  private async ensureUniqueSlug(slug: string, excludeId?: string) {
    const existingCategory = await this.categoriesRepository.findOne({
      where: {
        slug,
      },
    });

    if (existingCategory && existingCategory.id !== excludeId) {
      throw new ConflictException('Category slug already exists.');
    }
  }
}
