import {
  Controller,
  Post,
  Body,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDoc } from '@/modules/auth/constants/auth-doc.constants';
import { SignUpDTO } from './dtos/sign-up.dto';
import { IResponse } from '@/utils/types/response.type';
import { SignUpResponse } from './domains/sign-up';
import { successResponse } from '@/utils/helpers/response.helper';
import { AUTH_CONSTANT } from './constants/auth.constant';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @AuthDoc.RegisterSummary()
  @AuthDoc.RegisterSuccess()
  @AuthDoc.RegisterBadRequest()
  @AuthDoc.RegisterConflict()
  async signUp(@Body() signUpDto: SignUpDTO): Promise<IResponse<SignUpResponse>> {
    const user = await this.authService.register(signUpDto);
    return successResponse(AUTH_CONSTANT.USER_REGISTERED_SUCCESSFULLY, HttpStatus.CREATED, user);
  }
}
