// src/course/course.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post('purchase')
  async purchaseCourse(
    @Body() body: { courseId: string; buyerAddress: string; ethAmount: string },
  ) {
    const { courseId, buyerAddress, ethAmount } = body;
    if (!courseId || !buyerAddress || !ethAmount) {
      throw new BadRequestException('缺少必要参数');
    }
    return await this.courseService.purchaseCourse(
      courseId,
      buyerAddress,
      ethAmount,
    );
  }
}
