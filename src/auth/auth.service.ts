import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto';
import { User } from '../users/entities/user.entity';

export interface AuthResult {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<AuthResult> {
    const user = await this.usersService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials or account is deactivated');
    }

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResult> {
    const user = await this.usersService.create(registerDto);

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async validateUserById(userId: string): Promise<User> {
    return this.usersService.findOne(userId);
  }

  async seedAdminUser(): Promise<void> {
    const adminEmail = 'admin@example.com';
    const existingAdmin = await this.usersService.findByEmail(adminEmail);

    if (!existingAdmin) {
      await this.usersService.create({
        firstName: 'Admin',
        lastName: 'User',
        email: adminEmail,
        password: 'admin123',
        role: 'admin' as any,
      });
    }
  }
}
