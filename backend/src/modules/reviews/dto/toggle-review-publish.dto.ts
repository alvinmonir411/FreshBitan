import { IsBoolean } from 'class-validator';

export class ToggleReviewPublishDto {
  @IsBoolean()
  isApproved!: boolean;
}
