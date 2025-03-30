// src/video/video.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);

  async handleUpload(file: Express.Multer.File, metadata: any): Promise<any> {
    this.logger.log(
      `视频上传成功，文件名: ${file.filename}, 原文件名: ${file.originalname}`,
    );
    this.logger.log(`附加元数据: ${JSON.stringify(metadata)}`);
    // 可在此处将视频信息存入数据库
    return {
      message: '视频上传成功',
      filename: file.filename,
      path: file.path,
      metadata,
    };
  }
}
