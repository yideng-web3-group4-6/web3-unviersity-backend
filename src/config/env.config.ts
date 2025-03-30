import { ConfigModuleOptions } from '@nestjs/config';

export const getEnvConfig = (): ConfigModuleOptions => {
  const nodeEnv = process.env.NODE_ENV || 'development';

  return {
    isGlobal: true,
    envFilePath: `.env.${nodeEnv}`,
  };
};
