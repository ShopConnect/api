import { ArrayNotEmpty, IsArray, IsBoolean, IsNumber } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderRequestItemDto {
  @IsNumber()
  @ApiProperty({
    required: true,
    type: 'number'
  })
  itemId: number;
  
  @IsNumber()
  @ApiProperty({
    required: true,
    type: 'number'
  })
  quantity: number;
  
  @IsBoolean()
  @ApiProperty({
    required: true,
    type: 'boolean'
  })
  isOptional: boolean;
}

export class CreateOrderRequestDto {
  @IsArray({})
  @ArrayNotEmpty()
  @ApiProperty({
    required: true,
    type: () => CreateOrderRequestItemDto,
    isArray: true
  })
  items: CreateOrderRequestItemDto[];
  
  @IsNumber()
  @ApiProperty({
    required: false,
    type: 'number'
  })
  maxValue?: number;
}