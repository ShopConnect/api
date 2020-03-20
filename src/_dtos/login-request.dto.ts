import { IsAlpha, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequestDto {
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(255)
  @IsAlpha()
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
  @IsAlpha()
  password: string;
}