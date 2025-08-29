import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    // const user = await this.authService.validateUserById(email);
    const user = {
      id: '1',
      email: 'admin@example.com',
      password: 'admin123',
    };
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
