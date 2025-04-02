// src/course/course.service.ts
import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import {
  CourseUploadConfirmDto,
  CourseResponse,
  CourseListResponseDto,
  CourseDetailDto,
  CourseListQueryDto,
} from './dto/course.dto';
import { CourseInfo } from './entities/course.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    @InjectRepository(CourseInfo)
    private readonly courseInfoRepository: Repository<CourseInfo>,
    private readonly uploadService: UploadService,
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
    // 存入数据库
    const courseInfo = new CourseInfo();
    courseInfo.fileId = courseData.fileId;
    courseInfo.title = courseData.title;
    courseInfo.description = courseData.description;
    courseInfo.categoryId = courseData.categoryId;

    const result = await this.courseInfoRepository.save(courseInfo);

    // 添加保存后的数据日志
    this.logger.debug(`Save result: ${JSON.stringify(result)}`);
    return {
      id: result.id,
      fileId: result.fileId,
      title: result.title,
      description: result.description,
      categoryId: result.categoryId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };
  }

  // 获取课程列表
  async getCourseList(
    query: CourseListQueryDto,
  ): Promise<CourseListResponseDto> {
    const { page = 1, pageSize = 10 } = query;
    const skip = (page - 1) * pageSize;

    const [courses, total] = await this.courseInfoRepository.findAndCount({
      order: {
        createdAt: 'DESC',
      },
      skip,
      take: pageSize,
    });

    // 获取每个课程的签名URL
    const coursesWithUrls = await Promise.all(
      courses.map(async (course) => {
        const fileUrl = await this.uploadService.getSignedUrl(course.fileId);
        console.log('fileUrl', fileUrl);
        return {
          id: course.id,
          fileId: course.fileId,
          title: course.title,
          description: course.description,
          categoryId: course.categoryId,
          createdAt: course.createdAt,
          updatedAt: course.updatedAt,
          fileUrl,
        };
      }),
    );

    return {
      courses: coursesWithUrls,
      total,
    };
  }

  // 获取课程详情
  async getCourseDetail(id: number): Promise<CourseDetailDto> {
    // 1. 通过id获取课程基本信息
    const courseInfo = await this.courseInfoRepository.findOne({
      where: { id },
    });

    if (!courseInfo) {
      throw new NotFoundException('课程不存在');
    }

    // 2. 通过fileId获取文件访问URL
    const fileUrl = await this.uploadService.getSignedUrl(courseInfo.fileId);

    // 3. 返回组装后的课程详情
    return {
      id: courseInfo.id,
      fileId: courseInfo.fileId,
      title: courseInfo.title,
      description: courseInfo.description,
      categoryId: courseInfo.categoryId,
      createdAt: courseInfo.createdAt,
      updatedAt: courseInfo.updatedAt,
      fileUrl,
    };
  }
}
