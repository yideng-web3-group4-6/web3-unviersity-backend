// src/video/video.controller.ts
import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common';
import { CourseService } from './course.service';
import { ApiTags, ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  CourseUploadConfirmDto,
  CourseResponse,
  ApiResponse as CourseApiResponse,
  CourseListApiResponse,
  CourseListQueryDto,
} from './dto/course.dto';

@ApiTags('课程管理')
@Controller('course')
// @UseGuards(AuthGuard('jwt'))
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('confirm')
  @ApiOperation({
    summary: '确认课程上传',
    description: '确认课程上传并保存课程信息到数据库',
  })
  @ApiBody({
    type: CourseUploadConfirmDto,
    description: '课程确认信息',
  })
  @ApiResponse({
    status: 200,
    description: '课程确认成功',
    type: CourseResponse,
  })
  @ApiResponse({
    status: 400,
    description: '无效的请求参数',
  })
  async confirmCourseUpload(
    @Body() courseData: CourseUploadConfirmDto,
  ): Promise<CourseApiResponse> {
    const result = await this.courseService.confirmCourseUpload(courseData);
    return {
      code: 200,
      message: 'success',
      data: result,
    };
  }

  @Get('list')
  @ApiOperation({
    summary: '获取课程列表',
    description: '获取所有课程的列表信息，支持分页',
  })
  @ApiResponse({
    status: 200,
    description: '获取课程列表成功',
    type: CourseListApiResponse,
  })
  async getCourseList(
    @Query() query: CourseListQueryDto,
  ): Promise<CourseListApiResponse> {
    const result = await this.courseService.getCourseList(query);
    return {
      code: 200,
      message: 'success',
      data: result,
    };
  }
}
