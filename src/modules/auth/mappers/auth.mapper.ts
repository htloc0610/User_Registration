
import { User } from '../../../database/entities/user.entity';
import { SignUpResponse } from '../domains/sign-up';

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
