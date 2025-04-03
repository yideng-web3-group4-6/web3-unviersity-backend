import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as mysql from 'mysql2/promise';
import { DatabaseConnectionService } from './database-connection.service';

@Injectable()
export class DatabaseInitService {
  private readonly logger = new Logger(DatabaseInitService.name);
  private readonly connectionService: DatabaseConnectionService;

  constructor(private configService: ConfigService) {
    this.connectionService = new DatabaseConnectionService(configService);
  }

  async initDatabase() {
    if (process.env.NODE_ENV === 'production') {
      this.logger.log('生产环境不进行数据库初始化');
      return;
    }

    const database = this.configService.get('DB_NAME', 'web3_university_dev');
    const nodeEnv = this.configService.get('NODE_ENV', 'development');

    try {
      const connectionConfig =
        await this.connectionService.getConnectionConfig();
      this.logger.log(
        `使用${
          nodeEnv === 'production' ? 'AWS RDS IAM' : '本地数据库'
        }认证进行连接`,
      );
      this.logger.log(connectionConfig);
      // 创建一个没有指定数据库的连接
      const connection = await mysql.createConnection(connectionConfig);
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
