import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../database/entities/user.entity';
import { SignUpDTO } from '../dtos/sign-up.dto';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async emailExists(email: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { email },
    });
    return count > 0;
  }
}
