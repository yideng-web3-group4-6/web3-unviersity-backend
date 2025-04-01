import { ApiProperty } from '@nestjs/swagger';

export class CourseUploadConfirmDto {
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
}

export class CourseResponse {
  @ApiProperty({
    description: '课程ID',
    example: 'cid-87654321',
  })
  courseId: string;

  @ApiProperty({
    description: '课程标题',
    example: '我的第一个课程',
  })
  title: string;

  @ApiProperty({
    description: '课程描述',
    example: '这是一个示例课程描述',
  })
  description: string;

  @ApiProperty({
    description: '分类ID',
    example: 1,
  })
  categoryId: number;

  @ApiProperty({
    description: '创建时间',
    example: '2025-03-30T10:30:15Z',
  })
  createdAt: Date;
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
    description: '课程标题',
    example: 'web3 class',
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
  videoUrl: string;
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
