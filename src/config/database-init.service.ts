import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseInitService {
  private readonly logger = new Logger(DatabaseInitService.name);

  constructor(private configService: ConfigService) {}

  async initDatabase() {
    // 在生产环境下跳过本地数据库初始化
    if (process.env.NODE_ENV === 'production') {
      this.logger.log('生产环境下跳过本地数据库初始化');
      return;
    }

    const host = this.configService.get('DB_HOST', 'localhost');
    const port = this.configService.get('DB_PORT', 3306);
    const username = this.configService.get('DB_USERNAME', 'root');
    const password = this.configService.get('DB_PASSWORD', '');
    const database = this.configService.get('DB_NAME', 'web3_university_dev');

    try {
      // 创建一个没有指定数据库的连接
      const connection = await mysql.createConnection({
        host,
        port,
        user: username,
        password,
      });

      // 检查数据库是否存在
      const [rows] = await connection.execute(
        `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${database}'`,
      );

      if (Array.isArray(rows) && rows.length === 0) {
        // 数据库不存在，创建它
        await connection.execute(`CREATE DATABASE IF NOT EXISTS ${database}`);
        this.logger.log(`数据库 ${database} 创建成功`);
      } else {
        this.logger.log(`数据库 ${database} 已存在`);
      }

      await connection.end();
    } catch (error) {
      this.logger.error('初始化数据库时发生错误:', error);
      throw error;
    }
  }
}
