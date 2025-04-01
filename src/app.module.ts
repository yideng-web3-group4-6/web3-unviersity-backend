import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { getDatabaseConfig } from './config/database.config';
import { ArticleModule } from './article/article.module';
import { AppConfigModule } from './config/config.module';
import { DatabaseInitService } from './config/database-init.service';
import { UploadModule } from './upload/upload.module';
import { CourseModule } from './course/course.module';

@Module({
  imports: [
    // 导入配置模块
    AppConfigModule,
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
    CourseModule,
    ArticleModule,
    UserModule,
    UploadModule,
  ],
  providers: [DatabaseInitService],
})
export class AppModule {}
