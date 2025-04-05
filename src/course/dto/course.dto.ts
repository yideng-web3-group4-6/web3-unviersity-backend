import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsString,
  IsNumber,
} from 'class-validator';

export class CourseUploadConfirmDto {
  @ApiProperty({
    description: '课程标题',
    example: '我的第一个课程',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: '课程描述',
    example: '这是一个示例课程描述',
  })
  @IsString()
  description?: string;

  @ApiProperty({
    description: '课程几周期',
    example: 1,
  })
  @IsNumber()
  duration: number;

  @ApiProperty({
    description: '课程价格',
    example: 100,
  })
  @IsNumber()
  price: number;

  @ApiProperty({
    description: '课程标签',
    example: 'Solidity,Remix,Hardhat',
  })
  @IsString()
  tags?: string;

  @ApiProperty({
    description: '课程难度',
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    example: 'Beginner',
  })
  @IsString()
  @IsNotEmpty()
  level: string;

  @ApiProperty({
    description: '课程图标',
    enum: [
      'BookOpen',
      'Code',
      'Layers',
      'Shield',
      'Database',
      'Zap',
      'Cpu',
      'Workflow',
    ],
    example: 'BookOpen',
  })
  @IsString()
  @IsNotEmpty()
  icon: string;
}

export class CourseResponse extends CourseUploadConfirmDto {
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

export class CourseListResponseDto {
  @ApiProperty({
    description: '课程列表',
    type: [CourseResponse],
  })
  courses: CourseResponse[];

  @ApiProperty({
    description: '总数',
    example: 100,
  })
  total: number;
}

export class CourseDetailDto extends CourseResponse {
  @ApiProperty({
    description: '文件集合',
  })
  children?: CourseChildrenResponse[];

  @ApiProperty({
    description: '封面url',
  })
  @IsString()
  coverImage?: string;

  @ApiProperty({
    description: '更新时间',
    example: '2024-03-30T10:30:15Z',
  })
  updatedAt: Date;
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

export class CourseChildrenResponse {
  @ApiProperty({
    description: '文件ID',
  })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: '文件url',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiProperty({
    description: '文件标题',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '创建时间',
  })
  createdAt: Date;
}

export class CourseFileResponse {
  @ApiProperty({
    description: '课程集合',
  })
  fileData: CourseChildrenResponse[];

  @ApiProperty({
    description: '封面url',
  })
  @IsString()
  coursesImage?: string;
}
