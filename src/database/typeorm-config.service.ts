import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import databaseConfig from './config/database-config';

export default registerAs(
  'typeorm',
  (): TypeOrmModuleOptions => {
    const config = databaseConfig();
    
    return {
      type: config.type as any,
      host: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
      database: config.name,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      logging: process.env.NODE_ENV === 'development',
      migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations',
      migrationsRun: false,
      synchronize: false, // Disable synchronize for production safety
      extra: {
        max: config.maxConnections,
        ssl: config.sslEnabled ? {
          rejectUnauthorized: config.rejectUnauthorized,
          ca: config.ca,
          key: config.key,
          cert: config.cert,
        } : false,
      },
    };
  },
);
