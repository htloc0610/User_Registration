import { IsNotEmpty, IsEmail, IsString, MaxLength, MinLength, registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import * as ERRORS from 'src/utils/constans/error_en.json';

// Custom validator for password complexity
function IsPasswordComplex(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPasswordComplex',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;
          
          const hasUpperCase = /[A-Z]/.test(value);
          const hasNumber = /\d/.test(value);
          const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
          
          return hasUpperCase && hasNumber && hasSpecialChar;
        },
        defaultMessage(args: ValidationArguments) {
          return 'Password must contain at least one uppercase letter, one number, and one special character';
        },
      },
    });
  };
}

export class SignUpDTO {
  @ApiProperty({ 
    example: 'John', 
    description: 'First name of the user',
    required: true,
    minLength: 2,
    maxLength: 50,
    name: "first_name"
  })
  @MinLength(2, { context: ERRORS.ALEM03 })
  @MaxLength(50, { context: ERRORS.ALEM04 })
  @IsString({ context: ERRORS.ALEM02 })
  @IsNotEmpty({ context: ERRORS.ALEM01 })
  @Expose({ name: "first_name" })
  firstName: string;

  @ApiProperty({ 
    example: 'Doe', 
    description: 'Last name of the user',
    required: true,
    minLength: 2,
    maxLength: 50,
    name: "last_name"
  })
  @MinLength(2, { context: ERRORS.ALEM03 })
  @MaxLength(50, { context: ERRORS.ALEM04 })
  @IsString({ context: ERRORS.ALEM02 })
  @IsNotEmpty({ context: ERRORS.ALEM01 })
  @Expose({ name: "last_name" })
  lastName: string;

  @ApiProperty({ 
    example: 'john@example.com', 
    description: 'Email address of the user',
    required: true
  })
  @IsNotEmpty({ context: ERRORS.ALEM01 })
  @IsEmail({}, { context: ERRORS.ALEM02 })
  @MaxLength(255, { context: ERRORS.ALEM04 })
  @Expose({ name: "email" })
  email: string;

  @ApiProperty({ 
    example: 'Password123!', 
    description: 'Password must contain at least one uppercase letter, one number, and one special character',
    required: true,
    minLength: 8
  })
  @IsNotEmpty({ context: ERRORS.ALEM01 })
  @IsString({ context: ERRORS.ALEM02 })
  @MinLength(8, { context: ERRORS.ALEM03 })
  @MaxLength(255, { context: ERRORS.ALEM04 })
  @Expose({ name: "password" })
  password: string;
}
