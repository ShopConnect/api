import { IsNotEmpty, MinLength, MaxLength, IsAlpha } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterRequestDto {
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