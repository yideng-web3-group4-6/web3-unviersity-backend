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
