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
    if (nodeEnv === 'production') {
      const region = this.configService.get('AWS_REGION', 'us-west-2');
      const accessKeyId = this.configService.get('AWS_ACCESS_KEY_ID');
      const secretAccessKey = this.configService.get('AWS_SECRET_ACCESS_KEY');

      const signer = new Signer({
        region,
        hostname: host,
        port,
        username,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const token = await signer.getAuthToken();

      return {
        ...baseConfig,
        password: token,
        ssl: {
          rejectUnauthorized: true,
        },
      };
    }

    return {
      ...baseConfig,
      password: this.configService.get('DB_PASSWORD', 'password'),
    };
  }
}
