
import { User } from '../../../database/entities/user.entity';
import { SignUpResponse } from '../domains/sign-up';
import { SignInResponse } from '../domains/sign-in';
import { JwtService } from '@nestjs/jwt';

export class AuthMapper {
  static toSignUpResponse(user: User): SignUpResponse {
    return new SignUpResponse(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.createdAt,
      user.updatedAt,
    );
  }

  static toSignInResponse(user: User, jwtService: JwtService): SignInResponse {
    // Generate access token
    const accessToken = jwtService.sign({
      sub: user.id,
      email: user.email,
      type: 'access'
    }, { expiresIn: '1h' });

    // Generate refresh token
    const refreshToken = jwtService.sign({
      sub: user.id,
      email: user.email,
      type: 'refresh'
    }, { expiresIn: '7d' });

    return new SignInResponse(accessToken, refreshToken);
  }
}
