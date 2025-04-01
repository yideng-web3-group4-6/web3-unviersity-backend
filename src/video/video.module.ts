// src/video/video.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoInfo } from './entities/video.entity';
import { VideoController } from './video.controller';
import { VideoService } from './video.service';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from '../services/s3.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([VideoInfo])],
  controllers: [VideoController],
  providers: [VideoService, S3Service],
})
export class VideoModule {}
