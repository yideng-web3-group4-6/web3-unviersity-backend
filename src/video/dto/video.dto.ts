import { ApiProperty } from '@nestjs/swagger';

export class VideoUploadConfirmDto {
  @ApiProperty({
    description: '文件ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  fileId: string;

  @ApiProperty({
    description: '视频标题',
    example: '我的第一个视频',
  })
  title: string;

  @ApiProperty({
    description: '视频描述',
    example: '这是一个示例视频描述',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: '分类ID',
    example: 1,
    required: false,
  })
  categoryId?: number;
  // tags?: number[];
}

export class VideoResponse {
  @ApiProperty({
    description: '视频ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  videoId: string;

  @ApiProperty({
    description: '视频URL',
    example: 'https://your-bucket.s3.region.amazonaws.com/video.mp4',
  })
  url: string;

  @ApiProperty({
    description: '视频时长（秒）',
    example: 120,
  })
  duration: number;

  @ApiProperty({
    description: '创建时间',
    example: '2024-03-31T12:00:00Z',
  })
  createdAt: string;
}

export class ApiResponse<T> {
  @ApiProperty({
    description: '响应状态码',
    example: 200,
  })
  code: number;

  @ApiProperty({
    description: '响应消息',
    example: 'success',
  })
  message: string;

  @ApiProperty({
    description: '响应数据',
  })
  data: T;
}
