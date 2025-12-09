export interface TokenPayload {
  userId: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export abstract class AuthenticationService {
  abstract hashPassword(password: string): Promise<string>;
  abstract comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean>;
  abstract generateTokens(payload: TokenPayload): Promise<AuthTokens>;
  abstract verifyAccessToken(token: string): Promise<TokenPayload>;
  abstract verifyRefreshToken(token: string): Promise<TokenPayload>;
  abstract revokeRefreshToken(token: string): Promise<void>;
  abstract revokeAllUserTokens(userId: string): Promise<void>;
}
