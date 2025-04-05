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
    try {
      // 验证标题长度
      if (courseData.title.length > 100) {
        throw new BadRequestException('课程标题不能超过100个字符');
      }
      // TODO:
      // 1. 根据 id 验证文件是否存在
      // 2. 处理课程元数据（时长、格式等）
      // 3. 保存到数据库
      // 4. 生成正式的课程访问地址

      // 存入数据库
      const courseInfo = this.courseInfoRepository.create({
        title: courseData.title,
        description: courseData.description,
        duration: courseData.duration,
        price: courseData.price,
        tags: courseData.tags,
        level: courseData.level,
        icon: courseData.icon,
      });

      return await this.courseInfoRepository.save(courseInfo);
    } catch (error) {
      this.logger.error('课程上传时发生错误: ', error);
      throw error;
    }
  }

  // 获取课程列表
  async getCourseList(
    query: CourseListQueryDto,
  ): Promise<CourseListResponseDto> {
    try {
      const { page = 1, pageSize = 10 } = query;
      const skip = (page - 1) * pageSize;

      const [courses, total] = await this.courseInfoRepository.findAndCount({
        order: {
          createdAt: 'DESC',
        },
        skip,
        take: pageSize,
      });

      return { courses, total };
    } catch (error) {
      this.logger.error('获取课程列表时发生错误: ', error);
      throw error;
    }
  }

  // 获取课程详情
  async getCourseDetail(id: string): Promise<CourseDetailDto> {
    try {
      // 通过id获取课程基本信息
      const courseInfo = await this.courseInfoRepository.findOne({
        where: { id },
      });

      if (!courseInfo) {
        throw new NotFoundException('课程不存在');
      }

      // 通过id获取文件访问URL
      const { fileData, coursesImage } = await this.uploadService.getSignedUrl(
        courseInfo.id,
      );

      // 返回组装后的课程详情
      return { ...courseInfo, coverImage: coursesImage, children: fileData };
    } catch (error) {
      this.logger.error('获取课程详情时发生错误: ', error);
      throw error;
    }
  }
}
