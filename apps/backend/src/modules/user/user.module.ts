import { Module } from '@nestjs/common';
import { UserResolver } from '../../infra/http/graphql/resolvers/user.resolver';
import { PrismaUserRepository } from '../../infra/database/prisma/prisma-user.repository';
import { UserRepository } from '../../core/repositories/user.repository';
import { HashService } from '../../core/services/hash.service';
import { BcryptHashService } from '../../infra/services/hash/bcrypt-hash.service';
import { CreateUserUseCase } from '../../core/use-cases/user/create-user.use-case';
import { FindAllUsersUseCase } from '../../core/use-cases/user/find-all-users.use-case';
import { FindUserByIdUseCase } from '../../core/use-cases/user/find-user-by-id.use-case';
import { FindUsersByRoleUseCase } from '../../core/use-cases/user/find-users-by-role.use-case';
import { UpdateUserUseCase } from '../../core/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '../../core/use-cases/user/delete-user.use-case';

@Module({
  providers: [
    UserResolver,
    { provide: UserRepository, useClass: PrismaUserRepository },
    { provide: HashService, useClass: BcryptHashService },
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindUserByIdUseCase,
    FindUsersByRoleUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: [UserRepository, HashService, FindUserByIdUseCase],
})
export class UserModule {}
