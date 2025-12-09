import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {
  AuthenticationService,
  TokenPayload,
  AuthTokens,
} from '../../../core/services/authentication.service';
import { RefreshTokenRepository } from '../../../core/repositories/refresh-token.repository';

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRATION = '15m';
const REFRESH_TOKEN_EXPIRATION_SECONDS = 7 * 24 * 60 * 60; // 7 days in seconds

@Injectable()
export class JwtAuthenticationService extends AuthenticationService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {
    super();
    this.accessTokenSecret =
      this.configService.getOrThrow<string>('JWT_ACCESS_SECRET');
    this.refreshTokenSecret =
      this.configService.getOrThrow<string>('JWT_REFRESH_SECRET');
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async generateTokens(payload: TokenPayload): Promise<AuthTokens> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.accessTokenSecret,
      expiresIn: ACCESS_TOKEN_EXPIRATION,
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.refreshTokenSecret,
      expiresIn: REFRESH_TOKEN_EXPIRATION_SECONDS,
    });

    // Store refresh token in database
    const expiresAt = new Date(
      Date.now() + REFRESH_TOKEN_EXPIRATION_SECONDS * 1000,
    );
    await this.refreshTokenRepository.create({
      token: refreshToken,
      userId: payload.userId,
      expiresAt,
    });

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    try {
      return await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.accessTokenSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    // Verify JWT signature and expiration
    let payload: TokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.refreshTokenSecret,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if token exists in database and is not revoked
    const isValid = await this.refreshTokenRepository.isValid(token);
    if (!isValid) {
      throw new UnauthorizedException(
        'Refresh token has been revoked or expired',
      );
    }

    return { userId: payload.userId, email: payload.email };
  }

  async revokeRefreshToken(token: string): Promise<void> {
    await this.refreshTokenRepository.revokeByToken(token);
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepository.revokeAllByUserId(userId);
  }
}
