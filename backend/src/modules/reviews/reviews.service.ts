import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, Review } from '../../entities';
import { CreateReviewDto } from './dto/create-review.dto';
import { ToggleReviewPublishDto } from './dto/toggle-review-publish.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewsRepository: Repository<Review>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    const product = await this.productsRepository.findOne({
      where: {
        id: createReviewDto.productId,
        isActive: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found.');
    }

    const review = this.reviewsRepository.create({
      ...createReviewDto,
      customerEmail: createReviewDto.customerEmail ?? null,
      comment: createReviewDto.comment ?? null,
      isApproved: false,
    });

    return this.reviewsRepository.save(review);
  }

  findPublic() {
    return this.reviewsRepository.find({
      where: {
        isApproved: true,
      },
      relations: {
        product: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  findAllAdmin() {
    return this.reviewsRepository.find({
      relations: {
        product: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updatePublishStatus(
    id: string,
    toggleReviewPublishDto: ToggleReviewPublishDto,
  ) {
    const review = await this.reviewsRepository.findOne({
      where: { id },
      relations: {
        product: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found.');
    }

    review.isApproved = toggleReviewPublishDto.isApproved;
    await this.reviewsRepository.save(review);

    return review;
  }
}
