import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpResponse } from './domains/sign-up';
import { SignInResponse } from './domains/sign-in';
import { SignUpDTO } from './dtos/sign-up.dto';
import { SignInDTO } from './dtos/sign-in.dto';
import { AuthMapper } from './mappers/auth.mapper';
import { AUTH_CONSTANT } from './constants/auth.constant';
import { User } from '@/database/entities/user.entity';
import { UserInfoResponse } from './domains/user-info';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: SignUpDTO): Promise<SignUpResponse> {
    const isEmailExists = await this.authRepository.emailExists(createUserDto.email);
    if (isEmailExists) {
      throw new ConflictException(AUTH_CONSTANT.USER_ALREADY_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = await this.authRepository.register(createUserDto, hashedPassword);
    return AuthMapper.toSignUpResponse(user);
  }

  async signIn(signInDto: SignInDTO): Promise<SignInResponse> {
    // Find user by email
    const user = await this.authRepository.findByEmail(signInDto.email);
    if (!user) {
      throw new UnauthorizedException(AUTH_CONSTANT.INVALID_CREDENTIALS);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(signInDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException(AUTH_CONSTANT.INVALID_CREDENTIALS);
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException(AUTH_CONSTANT.ACCOUNT_DEACTIVATED);
    }
    
    // Generate token
    const tokens = await this.authRepository.generateToken(user.id);

    return tokens;
  }
  
  async refreshToken(refreshToken: string): Promise<SignInResponse> {
    // Verify refresh token
    let payload: { sub: string };
    try {
      payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
      }) as { sub: string };
    } catch (error) {
      throw new UnauthorizedException(AUTH_CONSTANT.INVALID_REFRESH_TOKEN);
    }

    // Find token in database
    const authToken = await this.authRepository.findByRefreshToken(refreshToken);
    if (!authToken) {
      throw new UnauthorizedException(AUTH_CONSTANT.INVALID_REFRESH_TOKEN);
    }

    // Check if refresh token is expired
    if (authToken.refreshExpiresAt < new Date()) {
      await this.authRepository.revokeToken(authToken.id);
      throw new UnauthorizedException(AUTH_CONSTANT.INVALID_REFRESH_TOKEN);
    }

    // Check if user is still active
    const user = await this.authRepository.findById(payload.sub);
    if (!user || !user.isActive) {
      await this.authRepository.revokeToken(authToken.id);
      throw new UnauthorizedException(AUTH_CONSTANT.ACCOUNT_DEACTIVATED);
    }

    // Generate new tokens and update existing token record
    const tokens = await this.authRepository.updateToken(authToken.id, payload.sub);

    return tokens;
  }

  async info(userId: string): Promise<UserInfoResponse> {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new NotFoundException(AUTH_CONSTANT.USER_NOT_FOUND);
    }
    return AuthMapper.toUserInfoResponse(user);
  }
}
