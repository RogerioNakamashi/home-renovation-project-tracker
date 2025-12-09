import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserResolver } from '../../infra/http/graphql/resolvers/user.resolver';
import { PrismaUserRepository } from '../../infra/database/prisma/prisma-user.repository';
import { PrismaRefreshTokenRepository } from '../../infra/database/prisma/prisma-refresh-token.repository';
import { UserRepository } from '../../core/repositories/user.repository';
import { RefreshTokenRepository } from '../../core/repositories/refresh-token.repository';
import { AuthenticationService } from '../../core/services/authentication.service';
import { JwtAuthenticationService } from '../../infra/services/authentication/jwt-authentication.service';
import { CreateUserUseCase } from '../../core/use-cases/user/create-user.use-case';
import { FindAllUsersUseCase } from '../../core/use-cases/user/find-all-users.use-case';
import { FindUserByIdUseCase } from '../../core/use-cases/user/find-user-by-id.use-case';
import { FindUsersByRoleUseCase } from '../../core/use-cases/user/find-users-by-role.use-case';
import { UpdateUserUseCase } from '../../core/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '../../core/use-cases/user/delete-user.use-case';
import { LoginUseCase } from '../../core/use-cases/user/login.use-case';
import { RefreshTokensUseCase } from '../../core/use-cases/user/refresh-tokens.use-case';
import { LogoutUseCase } from '../../core/use-cases/user/logout.use-case';

@Module({
  imports: [ConfigModule, JwtModule.register({})],
  providers: [
    UserResolver,
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: RefreshTokenRepository, useClass: PrismaRefreshTokenRepository },
    { provide: AuthenticationService, useClass: JwtAuthenticationService },
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindUserByIdUseCase,
    FindUsersByRoleUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    LoginUseCase,
    RefreshTokensUseCase,
    LogoutUseCase,
  ],
  exports: [UserRepository, AuthenticationService, FindUserByIdUseCase],
})
export class UserModule {}
