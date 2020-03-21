import { ApiProperty } from "@nestjs/swagger";

export class RegisterResponseDto {
    @ApiProperty()
    public readonly success: boolean

    /**
     * Creates the register response model
     * @param success Indicates wether the user was successfully registered
     */
    constructor(
        success: boolean
    ) {
        this.success = success;
    }
}