export interface RefreshTokenData {
  token: string;
  userId: string;
  expiresAt: Date;
}

export abstract class RefreshTokenRepository {
  abstract create(data: RefreshTokenData): Promise<void>;
  abstract isValid(token: string): Promise<boolean>;
  abstract revokeByToken(token: string): Promise<void>;
  abstract revokeAllByUserId(userId: string): Promise<void>;
}
