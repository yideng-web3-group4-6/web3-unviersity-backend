// src/course/course.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseInfo } from './entities/course.entity';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([CourseInfo])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
