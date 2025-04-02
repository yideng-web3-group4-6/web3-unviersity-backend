// src/course/course.service.ts
import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  CourseUploadConfirmDto,
  CourseResponse,
  CourseListResponseDto,
  CourseDetailDto,
  CourseListQueryDto,
} from './dto/course.dto';
import { CourseInfo } from './entities/course.entity';
import { FileInfo } from './entities/file-info.entity';
@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);
  private s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(
    @InjectRepository(CourseInfo)
    private readonly courseInfoRepository: Repository<CourseInfo>,
    @InjectRepository(FileInfo)
    private readonly fileInfoRepository: Repository<FileInfo>,
  ) {
    // 初始化 S3 客户端
    this.region = process.env.AWS_REGION || 'ap-northeast-1';
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
    this.bucketName = process.env.AWS_S3_BUCKET_NAME;

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      signingRegion: this.region,
      forcePathStyle: true,
    });
  }

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
        const fileUrl = await this.getSignedUrl(course.fileId);
        return {
          id: course.id,
          fileUrl,
          fileId: course.fileId,
          title: course.title,
          description: course.description,
          categoryId: course.categoryId,
          updatedAt: course.updatedAt,
          createdAt: course.createdAt,
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
    const fileUrl = await this.getSignedUrl(courseInfo.fileId);

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

  // 获取文件签名URL
  private async getSignedUrl(
    fileId: string,
    expiresIn = 3600,
  ): Promise<string> {
    const fileInfo = await this.fileInfoRepository.findOne({
      where: { fileId },
    });

    if (!fileInfo) {
      throw new Error('文件不存在');
    }

    const command = new GetObjectCommand({
      Bucket: fileInfo.bucket,
      Key: fileInfo.key,
    });

    try {
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn,
      });
      return signedUrl;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`);
      throw new Error('生成预签名URL失败');
    }
  }
}
