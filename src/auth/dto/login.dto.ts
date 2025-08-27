import { IsNotEmpty, IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ 
    example: 'admin@example.com', 
    description: 'Email address of the user' 
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'password123', 
    description: 'Password of the user' 
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
