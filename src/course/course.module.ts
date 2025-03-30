// src/course/course.module.ts
import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { ContractService } from '../contract/contract.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, ContractService],
})
export class CourseModule {}
