// src/video/video.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { CourseUploadConfirmDto, CourseResponse } from './dto/course.dto';
import { CourseInfo } from './entities/course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    @InjectRepository(CourseInfo)
    private readonly courseInfoRepository: Repository<CourseInfo>,
  ) {}

  async handleUpload(file: Express.Multer.File, metadata: any): Promise<any> {
    this.logger.log(
      `课程上传成功，文件名: ${file.filename}, 原文件名: ${file.originalname}`,
    );
    this.logger.log(`附加元数据: ${JSON.stringify(metadata)}`);
    // 可在此处将课程信息存入数据库
    return {
      message: '课程上传成功',
      filename: file.filename,
      path: file.path,
      metadata,
    };
  }

  async confirmCourseUpload(
    courseData: CourseUploadConfirmDto,
  ): Promise<CourseResponse> {
    // 验证标题长度
    if (courseData.title.length > 100) {
      throw new BadRequestException('课程标题不能超过100个字符');
    }

    // 存入数据库
    const courseInfo = new CourseInfo();
    courseInfo.fileId = courseData.fileId;
    courseInfo.title = courseData.title;
    courseInfo.description = courseData.description;
    courseInfo.categoryId = courseData.categoryId;
    const result = await this.courseInfoRepository.save(courseInfo);

    // TODO:
    // 1. 根据 fileId 验证文件是否存在
    // 2. 处理课程元数据（时长、格式等）
    // 3. 保存到数据库
    // 4. 生成正式的课程访问地址

    // 模拟实现
    return {
      courseId: result.id.toString(),
      title: result.title,
      description: result.description,
      categoryId: result.categoryId,
      createdAt: result.createdAt,
    };
  }
}
