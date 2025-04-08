import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export enum ArticleStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

class PageConditions {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    default: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({
    description: 'Number of items per page(Page Size)',
    example: 10,
    default: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  pageSize?: number;
}

export class SearchArticleDto extends PageConditions {
  @ApiProperty({
    description: 'Article title',
    example: 'Introduction to NestJS',
  })
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty({
    description: 'Slug for the article (optional)',
    example: 'introduction-to-nestjs',
    required: false,
  })
  @IsOptional()
  @IsString()
  slug?: string;

  // @ApiProperty({
  //   description: 'Meta title for SEO (optional)',
  //   example: 'Learn NestJS',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // metaTitle?: string;

  // @ApiProperty({
  //   description: 'Meta description for SEO (optional)',
  //   example: 'A comprehensive guide to NestJS',
  //   required: false,
  // })
  // @IsOptional()
  // @IsString()
  // metaDescription?: string;

  @ApiProperty({
    description: 'Status of the article',
    enum: ArticleStatus,
    example: ArticleStatus.DRAFT,
    required: false,
  })
  @IsOptional()
  @IsEnum(ArticleStatus)
  status?: ArticleStatus;

  @ApiProperty({
    description: 'Author ID (optional)',
    example: 1,
    required: false,
  })
  @IsOptional()
  authorId?: number;

  @ApiProperty({
    description:
      'User ID who liked(optional), this will search for articles liked by the user',
    example: 1,
    required: false,
  })
  @IsOptional()
  likedUserId?: number;

  @ApiProperty({
    description:
      'User ID who favorited(optional), this will search for articles favorited by the user',
    example: 1,
    required: false,
  })
  @IsOptional()
  favoritedUserId?: number;

  // TODO: 按照时间段查询
}
