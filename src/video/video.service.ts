// src/video/video.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { VideoUploadConfirmDto, VideoResponse } from './dto/video.dto';
import { VideoInfo } from './entities/video.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);

  constructor(
    @InjectRepository(VideoInfo)
    private readonly videoInfoRepository: Repository<VideoInfo>,
  ) {}

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

  async confirmVideoUpload(
    videoData: VideoUploadConfirmDto,
  ): Promise<VideoResponse> {
    // 验证标题长度
    if (videoData.title.length > 100) {
      throw new BadRequestException('视频标题不能超过100个字符');
    }

    // 存入数据库
    const videoInfo = new VideoInfo();
    videoInfo.fileId = videoData.fileId;
    videoInfo.title = videoData.title;
    videoInfo.description = videoData.description;
    videoInfo.categoryId = videoData.categoryId;
    const result = await this.videoInfoRepository.save(videoInfo);

    // TODO:
    // 1. 根据 fileId 验证文件是否存在
    // 2. 处理视频元数据（时长、格式等）
    // 3. 保存到数据库
    // 4. 生成正式的视频访问地址

    // 模拟实现
    // @ts-ignore
    return result;
  }
}
