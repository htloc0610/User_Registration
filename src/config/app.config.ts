import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api',
  nodeEnv: process.env.NODE_ENV || 'development',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: process.env.CORS_CREDENTIALS === 'true' || true,
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true' || process.env.NODE_ENV !== 'production',
    title: process.env.SWAGGER_TITLE || 'Student API',
    description: process.env.SWAGGER_DESCRIPTION || 'Student Management API Documentation',
    version: process.env.SWAGGER_VERSION || '1.0.0',
    tag: process.env.SWAGGER_TAG || 'student-api',
  },
}));
