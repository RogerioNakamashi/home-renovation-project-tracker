import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepository } from '../../repositories/user.repository';
import {
  AuthenticationService,
  AuthTokens,
} from '../../services/authentication.service';

export interface RefreshTokensInput {
  refreshToken: string;
}

export interface RefreshTokensOutput {
  tokens: AuthTokens;
}

@Injectable()
export class RefreshTokensUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async execute(input: RefreshTokensInput): Promise<RefreshTokensOutput> {
    // Verify the refresh token (checks JWT + database)
    const payload = await this.authenticationService.verifyRefreshToken(
      input.refreshToken,
    );

    // Verify user still exists
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Revoke old refresh token (rotation)
    await this.authenticationService.revokeRefreshToken(input.refreshToken);

    // Generate new tokens
    const tokens = await this.authenticationService.generateTokens({
      userId: user.id,
      email: user.email,
    });

    return { tokens };
  }
}
