import { ApiProperty } from "@nestjs/swagger";

export class RegisterDeviceResponseDto {
    @ApiProperty()
    public readonly success: boolean

    /**
     * Creates the register device response model
     * @param success Indicates wether the device was successfully registered
     */
    constructor(
        success: boolean
    ) {
        this.success = success;
    }
}