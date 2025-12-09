import { Injectable } from '@nestjs/common';
import { AuthenticationService } from '../../services/authentication.service';

export interface LogoutInput {
  refreshToken: string;
}

@Injectable()
export class LogoutUseCase {
  constructor(private readonly authenticationService: AuthenticationService) {}

  async execute(input: LogoutInput): Promise<void> {
    await this.authenticationService.revokeRefreshToken(input.refreshToken);
  }
}
