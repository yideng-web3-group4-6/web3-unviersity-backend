import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileInfo } from './entities/file-info.entity';
import {
  CourseChildrenResponse,
  CourseFileResponse,
} from '@/course/dto/course.dto';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private s3Client: S3Client;
  private readonly bucketName: string;
  private readonly region: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(FileInfo)
    private readonly fileInfoRepository: Repository<FileInfo>,
  ) {
    this.region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    this.logger.debug(
      `AWS Config - Region: ${this.region}, Bucket: ${this.bucketName}`,
    );

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

  async uploadFile(
    file: Express.Multer.File,
    title: string,
  ): Promise<FileInfo> {
    const key = `uploads/${file.originalname}`;
    this.logger.debug(
      `Attempting to upload file: ${key} to bucket: ${this.bucketName}`,
    );

    try {
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ServerSideEncryption: 'AES256',
        },
      });

      await upload.done();

      // 保存文件信息到数据库
      const fileInfo = new FileInfo();
      fileInfo.title = title;
      fileInfo.originalName = file.originalname;
      fileInfo.mimeType = file.mimetype;
      fileInfo.size = file.size;
      fileInfo.key = key;
      fileInfo.bucket = this.bucketName;
      fileInfo.region = this.region;

      return await this.fileInfoRepository.save(fileInfo);
    } catch (error) {
      this.logger.error(`Upload failed: ${error.message}`);
      throw new Error(`上传文件失败: ${error.message}`);
    }
  }

  async getSignedUrl(
    correlationId: string,
    expiresIn = 3600,
  ): Promise<CourseFileResponse> {
    try {
      const fileInfo = await this.fileInfoRepository.find({
        where: { correlationId },
        order: { createdAt: 'DESC' },
      });

      if (fileInfo.length === 0) {
        this.logger.warn(`No files found for courseId: ${correlationId}`);
        return { fileData: [], coursesImage: '' };
      }

      const fileData: CourseChildrenResponse[] = [];
      let coursesImage = '';

      const urlPromises = fileInfo.map(async (file) => {
        const command = new GetObjectCommand({
          Bucket: file.bucket,
          Key: file.key,
        });
        const signedUrl = await getSignedUrl(this.s3Client, command, {
          expiresIn,
        });
        if (file.mimeType.includes('video')) {
          return {
            id: file.id,
            url: signedUrl,
            title: file.title,
            createdAt: file.createdAt,
          };
        } else if (file.mimeType.includes('image')) {
          coursesImage = signedUrl;
          return null;
        }
        return null;
      });

      const results = (await Promise.all(urlPromises)).filter(
        (item): item is CourseChildrenResponse => item !== null,
      );
      fileData.push(...results);

      return { fileData, coursesImage };
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`);
      throw new Error('生成预签名URL失败');
    }
  }

  async getSingleSignedUrl(id: string, expiresIn = 3600): Promise<string> {
    const fileInfo = await this.fileInfoRepository.findOne({
      where: { id },
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
