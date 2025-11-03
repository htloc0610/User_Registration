import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Res,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDoc } from './constants/auth-doc.constants';
import { SignUpDTO } from './dtos/sign-up.dto';
import { SignInDTO } from './dtos/sign-in.dto';
import { RefreshTokenDTO } from './dtos/refresh-token.dto';
import { IResponse } from '../../utils/types/response.type';
import { SignUpResponse } from './domains/sign-up';
import { successResponse } from '../../utils/helpers/response.helper';
import { AUTH_CONSTANT } from './constants/auth.constant';
import { User } from '../../database/entities/user.entity';
import { CurrentUser } from '@/common/decorators/user.decorator';
import { UserInfoResponse } from './domains/user-info';

@ApiTags('Authentication')
@Controller('user')
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
  async signIn(@Body() signInDto: SignInDTO, @Res() res: Response): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.signIn(signInDto);
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 });
    res.status(HttpStatus.OK).json(successResponse(AUTH_CONSTANT.LOGIN_SUCCESS, HttpStatus.OK, { accessToken, refreshToken }));
  }

  @Post('logout')
  @AuthDoc.LogoutSummary()
  @HttpCode(HttpStatus.OK)
  async logout(@Res() res: Response): Promise<void> {
    res.clearCookie('accessToken');
    res.status(HttpStatus.OK).json(successResponse(AUTH_CONSTANT.LOGOUT_SUCCESS, HttpStatus.OK));
  }

  @Post('refresh-token')
  @AuthDoc.RefreshTokenSummary()
  @AuthDoc.RefreshTokenSuccess()
  @AuthDoc.RefreshTokenBadRequest()
  @AuthDoc.RefreshTokenUnauthorized()
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDTO, @Res() res: Response): Promise<void> {
    const { accessToken, refreshToken } = await this.authService.refreshToken(refreshTokenDto.refreshToken);
    res.cookie('accessToken', accessToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 1000 * 60 * 60 * 24 });
    res.status(HttpStatus.OK).json(successResponse(AUTH_CONSTANT.REFRESH_TOKEN_SUCCESS, HttpStatus.OK, { accessToken, refreshToken }));
  }

  @Get('info')
  @AuthDoc.InfoSummary()
  @AuthDoc.InfoSuccess()
  @AuthDoc.InfoBadRequest()
  @AuthDoc.InfoUnauthorized()
  @HttpCode(HttpStatus.OK)
  async info(@CurrentUser() user: User): Promise<IResponse<UserInfoResponse>> {
    if (!user) {
      throw new UnauthorizedException(AUTH_CONSTANT.UNAUTHORIZED);
    }
    const userInfo = await this.authService.info(user.id);
    return successResponse(AUTH_CONSTANT.INFO_SUCCESS, HttpStatus.OK, userInfo);
  }
}
