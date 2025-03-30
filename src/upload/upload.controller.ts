import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  MaxFileSizeValidator,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import {
  ApiTags,
  ApiConsumes,
  ApiBody,
  ApiOperation,
  ApiResponse,
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
            '要上传的文件（支持格式：jpg, jpeg, png, pdf, doc, docx）',
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
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 5MB
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|pdf|doc|doc|mp4)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const fileUrl = await this.uploadService.uploadFile(file);
      return {
        success: true,
        message: '文件上传成功',
        data: {
          url: fileUrl,
          filename: file.originalname,
          size: file.size,
          mimetype: file.mimetype,
        },
      };
    } catch (error) {
      throw new BadRequestException('文件上传失败：' + error.message);
    }
  }
}
