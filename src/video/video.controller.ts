// src/video/video.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
  BadRequestException,
  Req,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { S3Service } from '../services/s3.service';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  VideoUploadConfirmDto,
  VideoResponse,
  ApiResponse as VideoApiResponse,
} from './dto/video.dto';

@ApiTags('视频管理')
@Controller('video')
@UseGuards(AuthGuard('jwt'))
export class VideoController {
  constructor(
    private readonly videoService: VideoService,
    private readonly s3Service: S3Service,
  ) {}

  /**
   * 视频上传接口（需要登录，携带 JWT token）
   */
  @Post('upload')
  @ApiOperation({ summary: '上传视频到 AWS S3' })
  @ApiSecurity('bearer')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: '视频文件（支持格式：mp4, mov, avi, mkv）',
        },
        title: {
          type: 'string',
          description: '视频标题',
        },
        description: {
          type: 'string',
          description: '视频描述',
        },
      },
      required: ['file', 'title'],
    },
  })
  @ApiResponse({ status: 201, description: '视频上传成功' })
  @ApiResponse({ status: 400, description: '无效的文件格式或大小' })
  @ApiResponse({ status: 401, description: '未授权' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 500 * 1024 * 1024 }), // 500MB
          new FileTypeValidator({ fileType: /(mp4|mov|avi|mkv)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: { title: string; description?: string },
    @Req() req,
  ) {
    try {
      // 上传到 S3
      const fileUrl = await this.s3Service.uploadFile(file);

      // 保存视频元数据
      const metadata = {
        ...body,
        uploadedBy: req.user.walletAddress,
        fileUrl,
        filename: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      };

      const result = await this.videoService.handleUpload(file, metadata);

      return {
        success: true,
        message: '视频上传成功',
        data: {
          ...result,
          url: fileUrl,
        },
      };
    } catch (error) {
      throw new BadRequestException('视频上传失败：' + error.message);
    }
  }

  @Post('confirm')
  @ApiOperation({
    summary: '确认视频上传',
    description: '确认视频上传并保存视频信息到数据库',
  })
  @ApiBody({
    type: VideoUploadConfirmDto,
    description: '视频确认信息',
  })
  @ApiResponse({
    status: 200,
    description: '视频确认成功',
    type: VideoResponse,
  })
  @ApiResponse({
    status: 400,
    description: '无效的请求参数',
  })
  async confirmVideoUpload(
    @Body() videoData: VideoUploadConfirmDto,
  ): Promise<VideoApiResponse<VideoResponse>> {
    const result = await this.videoService.confirmVideoUpload(videoData);
    return {
      code: 200,
      message: 'success',
      data: result,
    };
  }
}
