import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoModule } from './video/video.module';
import { UserModule } from './user/user.module';
import { getDatabaseConfig } from './config/database.config';
import { ArticleModule } from './article/article.module';
import { getEnvConfig } from './config/env.config';
import { DatabaseInitService } from './config/database-init.service';
import { UploadModule } from './upload/upload.module';
@Module({
  imports: [
    // 加载 .env 文件中的环境变量，并全局生效
    ConfigModule.forRoot(getEnvConfig()),
    // 使用异步工厂方法构建 TypeORM 配置，并通过 ConfigService 读取环境变量
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseInitService = new DatabaseInitService(configService);
        await databaseInitService.initDatabase();
        return getDatabaseConfig(configService);
      },
    }),
    VideoModule,
    ArticleModule,
    UserModule,
    UploadModule,
  ],
  providers: [DatabaseInitService],
})
export class AppModule {}
