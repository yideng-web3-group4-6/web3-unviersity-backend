import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('文件上传')
@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: '上传文件到 AWS S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description:
            '要上传的文件（支持格式：jpg, jpeg, png, pdf, doc, docx, mp4）',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: '文件上传成功' })
  @ApiResponse({ status: 400, description: '无效的文件格式或大小' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|pdf|doc|docx|mp4)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Query('title') title?: string,
  ) {
    try {
      const fileInfo = await this.uploadService.uploadFile(file, title);
      return {
        success: true,
        message: '文件上传成功',
        data: {
          fileInfo,
        },
      };
    } catch (error) {
      throw new BadRequestException('文件上传失败：' + error.message);
    }
  }

  @Get(':id')
  @ApiOperation({ summary: '获取单个文件的预签名URL' })
  @ApiParam({ name: 'id', description: '文件ID' })
  @ApiQuery({
    name: 'expiresIn',
    required: false,
    description: 'URL过期时间（秒），默认3600秒',
  })
  @ApiResponse({ status: 200, description: '获取预签名URL成功' })
  @ApiResponse({ status: 404, description: '文件不存在' })
  async getSignedUrl(
    @Param('id') id: string,
    @Query('expiresIn') expiresIn?: number,
  ) {
    try {
      const signedUrl = await this.uploadService.getSingleSignedUrl(
        id,
        expiresIn,
      );
      return {
        success: true,
        message: '获取预签名URL成功',
        data: {
          url: signedUrl,
          expiresIn: expiresIn || 3600,
        },
      };
    } catch (error) {
      throw new BadRequestException('获取预签名URL失败：' + error.message);
    }
  }
}
