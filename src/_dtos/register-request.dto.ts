import { IsNotEmpty, MinLength, MaxLength, IsAlpha, IsEmail } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class RegisterRequestDto {
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