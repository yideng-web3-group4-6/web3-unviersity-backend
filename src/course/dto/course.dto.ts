import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CourseUploadConfirmDto {
  constructor() {
    console.log('CourseUploadConfirmDto constructed');
  }

  @ApiProperty({
    description: '文件ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty({ message: '文件ID不能为空' })
  @IsString({ message: '文件ID必须是字符串' })
  fileId: string;

  @ApiProperty({
    description: 'title',
    example: 'title',
  })
  @IsNotEmpty({ message: '课程标题不能为空' })
  @IsString({ message: '课程标题必须是字符串' })
  @MaxLength(100, { message: '课程标题不能超过100个字符' })
  title: string;

  @ApiProperty({
    description: 'description',
    example: 'description',
    required: false,
  })
  @IsOptional()
  @IsString({ message: '课程描述必须是字符串' })
  description?: string;

  @ApiProperty({
    description: '分类ID',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt({ message: '分类ID必须是整数' })
  categoryId?: number;
}

export class CourseResponse {
  @ApiProperty({
    description: '课程ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '文件ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  fileId: string;

  @ApiProperty({
    description: '课程标题',
    example: '我的第一个课程',
  })
  title: string;

  @ApiProperty({
    description: '课程描述',
    example: '这是一个示例课程描述',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '分类ID',
    example: 1,
    required: false,
  })
  categoryId?: number;

  @ApiProperty({
    description: '创建时间',
    example: '2024-03-30T10:30:15Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2024-03-30T10:30:15Z',
  })
  updatedAt: Date;
}

export class ApiResponse {
  @ApiProperty({
    description: '状态码',
    example: 200,
  })
  code: number;

  @ApiProperty({
    description: '状态描述',
    example: 'success',
  })
  message: string;

  @ApiProperty({
    description: '响应数据',
    type: CourseResponse,
  })
  data: CourseResponse;
}

export class CourseListItemDto {
  @ApiProperty({
    description: '课程ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: '文件ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  fileId: string;

  @ApiProperty({
    description: '课程标题',
    example: 'web3',
  })
  title: string;

  @ApiProperty({
    description: '课程描述',
    example: 'how to learn web3',
  })
  description: string;

  @ApiProperty({
    description: '分类ID',
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    description: '创建时间',
    example: '2024-03-30T10:30:15Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: '更新时间',
    example: '2024-03-30T10:30:15Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: '视频URL',
    example: 'https://example.com/video.mp4',
  })
  fileUrl: string;
}

export class CourseListResponseDto {
  @ApiProperty({
    description: '课程列表',
    type: [CourseListItemDto],
  })
  courses: CourseListItemDto[];

  @ApiProperty({
    description: '总数',
    example: 100,
  })
  total: number;
}

export class CourseDetailDto extends CourseListItemDto {
  @ApiProperty({
    description: '文件ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  fileId: string;

  @ApiProperty({
    description: '视频URL',
    example: 'https://example.com/video.mp4',
  })
  fileUrl: string;
}

export class CourseListApiResponse {
  @ApiProperty({
    description: '状态码',
    example: 200,
  })
  code: number;

  @ApiProperty({
    description: '状态描述',
    example: 'success',
  })
  message: string;

  @ApiProperty({
    description: '响应数据',
    type: CourseListResponseDto,
  })
  data: CourseListResponseDto;
}

export class CourseDetailApiResponse {
  @ApiProperty({
    description: '状态码',
    example: 200,
  })
  code: number;

  @ApiProperty({
    description: '状态描述',
    example: 'success',
  })
  message: string;

  @ApiProperty({
    description: '响应数据',
    type: CourseDetailDto,
  })
  data: CourseDetailDto;
}

export class CourseListQueryDto {
  @ApiProperty({
    description: '页码',
    example: 1,
    required: false,
    default: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    description: '每页数量',
    example: 10,
    required: false,
    default: 10,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;
}

export class CourseDetailByFileIdDto {
  @ApiProperty({
    description: '文件ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  fileId: string;
}

export class CourseDetailByFileIdResponseDto {
  @ApiProperty({
    description: '视频URL',
    example: 'https://example.com/video.mp4',
  })
  videoUrl: string;

  @ApiProperty({
    description: '文件名',
    example: 'example.mp4',
  })
  fileName: string;

  @ApiProperty({
    description: '文件大小',
    example: 1024000,
  })
  size: number;

  @ApiProperty({
    description: '文件类型',
    example: 'video/mp4',
  })
  mimeType: string;
}

export class CourseDetailByFileIdApiResponse {
  @ApiProperty({
    description: '状态码',
    example: 200,
  })
  code: number;

  @ApiProperty({
    description: '状态描述',
    example: 'success',
  })
  message: string;

  @ApiProperty({
    description: '响应数据',
    type: CourseDetailByFileIdResponseDto,
  })
  data: CourseDetailByFileIdResponseDto;
}
