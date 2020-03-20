export class LoginResponseDto {
    /**
     * Creates the login response model
     * @param token Access token for the authenticated user
     */
    constructor(
        public readonly token: string,
    ) { }
}