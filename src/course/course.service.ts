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
    return {
      fileId: result.id.toString(),
      title: result.title,
      description: result.description,
      categoryId: result.categoryId,
      createdAt: result.createdAt,
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

    return {
      courses: courses.map((course) => ({
        id: course.id,
        fileId: course.fileId,
        title: course.title,
        description: course.description,
        categoryId: course.categoryId,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      })),
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
