import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import { SignUpDTO } from '../dtos/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthToken } from '../../../database/entities/auth-token.entity';
import { SignInResponse } from '../domains/sign-in';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(AuthToken)
    private readonly tokenRepository: Repository<AuthToken>,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: SignUpDTO, passwordHash: string): Promise<User> {
    // Create user entity with default values
    const userEntity = this.userRepository.create({
      email: createUserDto.email,
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      passwordHash: passwordHash,
      isActive: true,
      emailVerified: false,
      isDeleted: false,
    });

    // Save user
    const savedUser = await this.userRepository.save(userEntity);

    return savedUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async generateToken(userId: string): Promise<SignInResponse> {
    const accessToken = this.jwtService.sign({ sub: userId }, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign({ sub: userId }, { expiresIn: '7d' });
    const tokenEntity = this.tokenRepository.create({
      userId: userId,
      accessToken: accessToken,
      refreshToken: refreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      refreshExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      revoked: false,
    });
    await this.tokenRepository.save(tokenEntity);
    return { accessToken, refreshToken };
  }

  async emailExists(email: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { email },
    });
    return count > 0;
  }

  async findById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId },
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<AuthToken | null> {
    return this.tokenRepository.findOne({
      where: { 
        refreshToken: refreshToken,
        revoked: false,
      },
      relations: ['user'],
    });
  }

  async revokeToken(tokenId: number): Promise<void> {
    await this.tokenRepository.update(
      { id: tokenId },
      { revoked: true }
    );
  }

  async updateToken(oldTokenId: number, userId: string): Promise<SignInResponse> {
    const accessToken = this.jwtService.sign({ sub: userId }, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign({ sub: userId }, { expiresIn: '7d' });
    
    await this.tokenRepository.update(
      { id: oldTokenId },
      {
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
        refreshExpiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        revoked: false,
      }
    );

    return { accessToken, refreshToken };
  }
}
