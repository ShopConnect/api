import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PatchUserRequestDto {
  @IsOptional()
  @MaxLength(255)
  @IsEmail()
  @ApiProperty({
    required: false,
    type: 'string'
  })
  email?: string;

  @IsOptional()
  @MinLength(8)
  @ApiProperty({
    required: false,
    type: 'string'
  })
  password?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string'
  })
  country?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string'
  })
  city?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string'
  })
  zipCode?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string'
  })
  street?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string'
  })
  houseNumber?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string'
  })
  payPalHandle?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string'
  })
  iban?: string;

  @IsOptional()
  @ApiProperty({
    required: false,
    type: 'string'
  })
  @IsPhoneNumber("ZZ")
  telephoneNumber?: string;
}