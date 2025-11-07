export interface JwtPayload {
  sub: string; // user id
  email: string; // user email
  tokenVersion: number;
  iat?: number; // issued at time
  exp?: number; // expiration time
}
