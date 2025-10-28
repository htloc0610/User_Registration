import { IsNotEmpty, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import * as ERRORS from '../../../utils/constans/error_en.json';

export class SignInDTO {
  @ApiProperty({ 
    example: 'john@example.com', 
    description: 'Email address of the user',
    required: true
  })
  @IsNotEmpty({ context: ERRORS.ALEM01 })
  @IsEmail({}, { context: ERRORS.ALEM02 })
  @Expose({ name: "email" })
  email: string;

  @ApiProperty({ 
    example: 'Password123!', 
    description: 'Password of the user',
    required: true
  })
  @IsNotEmpty({ context: ERRORS.ALEM01 })
  @IsString({ context: ERRORS.ALEM02 })
  @Expose({ name: "password" })
  password: string;
}
