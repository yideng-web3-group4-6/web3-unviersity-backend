import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { VideoModule } from './video/video.module';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';

@Module({
  imports: [
    // 加载 .env 文件中的环境变量，并全局生效
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // 使用异步工厂方法构建 TypeORM 配置，并通过 ConfigService 读取环境变量
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const dbPassword = configService.get('DB_PASSWORD', 'password');
        return {
          type: configService.get<'mysql'>('DB_TYPE', 'mysql'),
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 3306),
          username: configService.get('DB_USERNAME', 'root'),
          password:
            typeof dbPassword === 'function' ? dbPassword() : dbPassword,
          database: configService.get('DB_NAME', 'yideng'),
          entities: [User],
          synchronize: configService.get<boolean>('DB_SYNC', false),
          autoLoadEntities: true,
        } as TypeOrmModuleOptions;
      },
    }),
    VideoModule,
    UserModule,
  ],
})
export class AppModule {}
