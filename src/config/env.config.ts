import { ConfigModuleOptions } from '@nestjs/config';

export const getEnvConfig = (): ConfigModuleOptions => {
  return {
    isGlobal: true,
    envFilePath:
      process.env.NODE_ENV === 'production'
        ? '.env.production'
        : '.env.development',
  };
};
