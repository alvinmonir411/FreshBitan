import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../../common/decorators/roles.decorator';
import { FULL_ADMIN_ACCESS_ROLES } from '../../common/constants/admin-roles.constant';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CreateReviewDto } from './dto/create-review.dto';
import { ToggleReviewPublishDto } from './dto/toggle-review-publish.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('public')
  createPublicReview(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewsService.create(createReviewDto);
  }

  @Get('public')
  getPublicReviews() {
    return this.reviewsService.findPublic();
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...FULL_ADMIN_ACCESS_ROLES)
  getAdminReviews() {
    return this.reviewsService.findAllAdmin();
  }

  @Patch(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(...FULL_ADMIN_ACCESS_ROLES)
  updatePublishStatus(
    @Param('id') id: string,
    @Body() toggleReviewPublishDto: ToggleReviewPublishDto,
  ) {
    return this.reviewsService.updatePublishStatus(id, toggleReviewPublishDto);
  }
}
