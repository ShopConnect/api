export class RegisterResponseDto {
    /**
     * Creates the register response model
     * @param success Indicates wether the user was successfully registered
     */
    constructor(
        public readonly success: boolean
    ) { }
}