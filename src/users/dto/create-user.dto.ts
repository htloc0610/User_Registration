import { IsNotEmpty, IsString, IsEmail, IsEnum, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsNotEmpty()
  @IsString()
  @Length(2, 100)
  lastName: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Email address of the user' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123!', description: 'Password for the user' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ 
    example: UserRole.STUDENT, 
    description: 'Role of the user',
    enum: UserRole,
    default: UserRole.STUDENT
  })
  @IsEnum(UserRole)
  role: UserRole = UserRole.STUDENT;
}
