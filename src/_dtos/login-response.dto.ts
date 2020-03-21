import { ApiProperty } from "@nestjs/swagger";

export class LoginResponseDto {
    @ApiProperty()
    public readonly token: string;

    /**
     * Creates the login response model
     * @param token Access token for the authenticated user
     */
    constructor(
        token: string,
    ) {
        this.token = token;
    }
}