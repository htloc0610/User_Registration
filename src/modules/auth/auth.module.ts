import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthRepository } from './repository/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { AuthToken } from '../../database/entities/auth-token.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: process.env.JWT_SECRET || ' your-super-secret-jwt-key-change-in-production',
        signOptions: {
          expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, AuthToken]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, AuthRepository],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
