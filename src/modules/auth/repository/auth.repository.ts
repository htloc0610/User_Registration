import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import { SignUpDTO } from '../dtos/sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthToken } from '@/database/entities';

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

  async generateToken(userId: string): Promise<{ accessToken: string; refreshToken: string }> {
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
}
