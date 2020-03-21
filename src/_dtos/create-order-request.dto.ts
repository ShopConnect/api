import { ArrayNotEmpty, IsArray, IsBoolean, IsNumber } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderItemRequestDto {
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
    type: () => CreateOrderItemRequestDto,
    isArray: true
  })
  items: CreateOrderItemRequestDto[];
  
  @IsNumber()
  @ApiProperty({
    required: false,
    type: 'number'
  })
  maxValue?: number;
}