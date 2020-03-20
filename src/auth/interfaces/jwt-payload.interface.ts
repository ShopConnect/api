export interface JwtPayload {
  /**
   * id of the authenticated user
   */
  id: number;

  /**
   * email of the authenticated user
   */
  email: string;

  /**
   * user creation timestamp
   */
  createdOn: number;

  /**
   * jwt token creation timestamp
   */
  timestamp: number;
}