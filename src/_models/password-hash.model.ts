export class PasswordHashModel {
    /**
     * Initializes the model
     * @param hash Users hashed password
     * @param salt Salt used to hash users password
     * @param iterations Iterations used to hash users password
     */
    constructor(
        public readonly hash: string,
        public readonly salt: string,
        public readonly iterations: number,
    ) { }
}