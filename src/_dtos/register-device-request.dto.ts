import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RegisterDeviceRequestDto {
    @IsNotEmpty()
    @ApiProperty({
      required: true,
      type: 'string'
    })
    token: string;
}