import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from './repository/auth.repository';
import * as bcrypt from 'bcrypt';
import { SignUpResponse } from './domains/sign-up';
import { SignUpDTO } from './dtos/sign-up.dto';
import { AuthMapper } from './mappers/auth.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: SignUpDTO): Promise<SignUpResponse> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      
      const user = await this.authRepository.register(createUserDto, hashedPassword);
      return AuthMapper.toSignUpResponse(user);
    } catch (error) {
      if (error.message === 'User with this email already exists') {
        throw new ConflictException('User with this email already exists');
      }
      throw new Error('Failed to create user');
    }
  }

}
