
import { User } from '../../../database/entities/user.entity';
import { SignUpResponse } from '../domains/sign-up';
import { UserInfoResponse } from '../domains/user-info';

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
  static toUserInfoResponse(user: User): UserInfoResponse {
    return new UserInfoResponse(
      user.id,
      user.firstName,
      user.lastName,
      user.email,
    );
  }
}
