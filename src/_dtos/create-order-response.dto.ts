import { ApiProperty } from "@nestjs/swagger";

export class CreateOrderResponseDto {
  @ApiProperty()
  public readonly success: boolean

    /**
     * Creates the create shopping list response model
     * @param success Indicates wether the shoppinglist was successfully registered
     */
  constructor(
    success: boolean
  ) {
    this.success = success;
  }
}