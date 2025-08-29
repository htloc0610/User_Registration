import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDoc } from '@/modules/auth/constants/auth-doc.constants';
import { SignUpDTO } from './dtos/sign-up.dto';
import { SignInDTO } from './dtos/sign-in.dto';
import { IResponse } from '@/utils/types/response.type';
import { SignUpResponse } from './domains/sign-up';
import { SignInResponse } from './domains/sign-in';
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
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() signUpDto: SignUpDTO): Promise<IResponse<SignUpResponse>> {
    const user = await this.authService.register(signUpDto);
    return successResponse(AUTH_CONSTANT.USER_REGISTERED_SUCCESSFULLY, HttpStatus.CREATED, user);
  }

  @Post('login')
  @AuthDoc.SignInSummary()
  @AuthDoc.SignInSuccess()
  @AuthDoc.SignInBadRequest()
  @AuthDoc.SignInUnauthorized()
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDTO): Promise<IResponse<SignInResponse>> {
    const tokens = await this.authService.signIn(signInDto);
    return successResponse(AUTH_CONSTANT.LOGIN_SUCCESS, HttpStatus.OK, tokens);
  }
}
