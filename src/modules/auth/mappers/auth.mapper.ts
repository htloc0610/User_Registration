
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
}
