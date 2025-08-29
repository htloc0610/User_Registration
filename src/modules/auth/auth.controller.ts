import {
  Controller,
  Post,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDoc } from '@/constants/auth-doc.constants';
import { SignUpDTO } from './dtos/sign-up.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @AuthDoc.RegisterSummary()
  @AuthDoc.RegisterSuccess()
  @AuthDoc.RegisterBadRequest()
  @AuthDoc.RegisterConflict()
  async signUp(@Body() signUpDto: SignUpDTO): Promise<any> {
    return signUpDto;
  }
}
