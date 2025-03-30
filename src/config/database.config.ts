import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';

export const getDatabaseConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  const dbPassword = configService.get('DB_PASSWORD', '');

  return {
    type: configService.get<'mysql'>('DB_TYPE', 'mysql'),
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 3306),
    username: configService.get('DB_USERNAME', 'root'),
    password: typeof dbPassword === 'function' ? dbPassword() : dbPassword,
    database: configService.get('DB_NAME', 'web3_university_dev'),
    entities: [User],
    synchronize: configService.get<boolean>('DB_SYNC', false),
    autoLoadEntities: true,
  } as TypeOrmModuleOptions;
};
