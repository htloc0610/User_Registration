import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import * as ERRORS from '../../../utils/constans/error_en.json';

export class RefreshTokenDTO {
  @ApiProperty({ 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', 
    description: 'Refresh token to generate new access token',
    required: true
  })
  @IsNotEmpty({ context: ERRORS.ALEM01 })
  @IsString({ context: ERRORS.ALEM02 })
  @Expose({ name: "refresh_token" })
  refreshToken: string;
}

