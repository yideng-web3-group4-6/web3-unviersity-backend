// src/video/video.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  /**
   * 视频上传接口（需要登录，携带 JWT token）
   */
  @Post('upload')
  // @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploads',
    }),
  )
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    // @Req() req,
  ) {
    if (!file) {
      throw new BadRequestException('未提供视频文件');
    }
    // 将上传的文件与当前用户关联
    // const metadata = { ...body, uploadedBy: req.user.walletAddress };
    const metadata = { ...body };
    return await this.videoService.handleUpload(file, metadata);
  }
}
