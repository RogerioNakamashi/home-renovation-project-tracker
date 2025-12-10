import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import {
  AuthenticationService,
  AuthTokens,
} from '../../services/authentication.service';

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginOutput {
  user: UserEntity;
  tokens: AuthTokens;
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authenticationService: AuthenticationService,
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const user = await this.userRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.authenticationService.comparePassword(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.authenticationService.generateTokens({
      userId: user.id,
      email: user.email,
    });

    return { user, tokens };
  }
}
