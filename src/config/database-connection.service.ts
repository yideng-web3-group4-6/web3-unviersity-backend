import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Signer } from '@aws-sdk/rds-signer';

@Injectable()
export class DatabaseConnectionService {
  constructor(private configService: ConfigService) {
    console.log(`Current environment: ${process.env.NODE_ENV}`);
  }

  async getConnectionConfig() {
    const nodeEnv = this.configService.get('NODE_ENV', 'development');
    const host = this.configService.get('DB_HOST', 'localhost');
    const username = this.configService.get('DB_USERNAME', 'admin');
    const port = this.configService.get<number>('DB_PORT', 3306);

    const baseConfig = {
      host,
      port,
      user: username,
    };
    return {
      ...baseConfig,
      password: this.configService.get('DB_PASSWORD', 'password'),
    };
  }
}
