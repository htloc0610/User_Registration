import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repository/auth.repository';
import * as bcrypt from 'bcrypt';
import { SignUpResponse } from './domains/sign-up';
import { SignUpDTO } from './dtos/sign-up.dto';
import { AuthMapper } from './mappers/auth.mapper';
import { AUTH_CONSTANT } from './constants/auth.constant';

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
}
