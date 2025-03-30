import { Injectable, Logger } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    const region = this.configService.get<string>('AWS_REGION');
    const accessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'AWS_SECRET_ACCESS_KEY',
    );
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');

    this.logger.debug(
      `AWS Config - Region: ${region}, Bucket: ${this.bucketName}`,
    );

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const key = `${Date.now()}-${file.originalname}`;
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
        },
      });

      await upload.done();
      const fileUrl = `https://${this.bucketName}.s3.amazonaws.com/${key}`;
      this.logger.debug(`File uploaded successfully: ${fileUrl}`);
      return fileUrl;
    } catch (error) {
      this.logger.error(`Upload failed: ${error.message}`);
      throw new Error(`上传文件失败: ${error.message}`);
    }
  }
}
