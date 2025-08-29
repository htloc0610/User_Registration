import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './repository/auth.repository';
import * as bcrypt from 'bcrypt';
import { SignUpResponse } from './domains/sign-up';
import { SignInResponse } from './domains/sign-in';
import { SignUpDTO } from './dtos/sign-up.dto';
import { SignInDTO } from './dtos/sign-in.dto';
import { AuthMapper } from './mappers/auth.mapper';
import { AUTH_CONSTANT } from './constants/auth.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
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
    const { accessToken, refreshToken } = await this.authRepository.generateToken(user.id);

    return { accessToken, refreshToken };
  }
}
