import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  @IsEmail()
  @ApiProperty({
    required: true,
    type: 'string'
  })
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    required: true,
    type: 'string'
  })
  password: string;
}