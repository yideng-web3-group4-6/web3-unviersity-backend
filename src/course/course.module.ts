// src/course/course.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseInfo } from './entities/course.entity';
import { FileInfo } from './entities/file-info.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CourseInfo, FileInfo])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
