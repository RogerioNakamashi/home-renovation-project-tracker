import { Module } from '@nestjs/common';
import { UserResolver } from '../../infra/http/graphql/resolvers/user.resolver';
import { PrismaUserRepository } from '../../infra/database/prisma/prisma-user.repository';
import { CreateUserUseCase } from '../../core/use-cases/user/create-user.use-case';
import { FindAllUsersUseCase } from '../../core/use-cases/user/find-all-users.use-case';
import { FindUserByIdUseCase } from '../../core/use-cases/user/find-user-by-id.use-case';
import { FindUsersByRoleUseCase } from '../../core/use-cases/user/find-users-by-role.use-case';
import { UpdateUserUseCase } from '../../core/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '../../core/use-cases/user/delete-user.use-case';
import { USER_REPOSITORY } from '../../core/repositories/user.repository';

@Module({
  providers: [
    UserResolver,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: CreateUserUseCase,
      useFactory: (repository) => new CreateUserUseCase(repository),
      inject: [USER_REPOSITORY],
    },
    {
      provide: FindAllUsersUseCase,
      useFactory: (repository) => new FindAllUsersUseCase(repository),
      inject: [USER_REPOSITORY],
    },
    {
      provide: FindUserByIdUseCase,
      useFactory: (repository) => new FindUserByIdUseCase(repository),
      inject: [USER_REPOSITORY],
    },
    {
      provide: FindUsersByRoleUseCase,
      useFactory: (repository) => new FindUsersByRoleUseCase(repository),
      inject: [USER_REPOSITORY],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (repository) => new UpdateUserUseCase(repository),
      inject: [USER_REPOSITORY],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (repository) => new DeleteUserUseCase(repository),
      inject: [USER_REPOSITORY],
    },
  ],
  exports: [USER_REPOSITORY],
})
export class UserModule {}
