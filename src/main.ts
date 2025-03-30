import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DatabaseInitService } from './config/database-init.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 初始化数据库
  const databaseInitService = app.get(DatabaseInitService);
  await databaseInitService.initDatabase();

  // 启用跨域以及全局路径前缀
  app.enableCors();
  app.setGlobalPrefix('api');

  // 创建 Swagger 配置
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Course Platform API')
    .setDescription('API 文档 - 课程平台')
    .setVersion('1.0')
    // .addBearerAuth() // 如果你需要 JWT 认证，请启用此项
    .build();

  // 生成文档
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  // 将文档挂载到 /api-docs 路径
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
