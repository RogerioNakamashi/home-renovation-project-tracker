import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserType, UserRoleEnum } from '../types/user.type';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput } from '../dto/update-user.input';
import { CreateUserUseCase } from '../../../../core/use-cases/user/create-user.use-case';
import { FindAllUsersUseCase } from '../../../../core/use-cases/user/find-all-users.use-case';
import { FindUserByIdUseCase } from '../../../../core/use-cases/user/find-user-by-id.use-case';
import { FindUsersByRoleUseCase } from '../../../../core/use-cases/user/find-users-by-role.use-case';
import { UpdateUserUseCase } from '../../../../core/use-cases/user/update-user.use-case';
import { DeleteUserUseCase } from '../../../../core/use-cases/user/delete-user.use-case';
import { UserRole } from '../../../../core/entities/user.entity';

@Resolver(() => UserType)
export class UserResolver {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly findAllUsersUseCase: FindAllUsersUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
    private readonly findUsersByRoleUseCase: FindUsersByRoleUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Query(() => [UserType], { name: 'users' })
  async findAll(): Promise<UserType[]> {
    const users = await this.findAllUsersUseCase.execute();
    return users.map((user) => this.toGraphQL(user));
  }

  @Query(() => UserType, { name: 'user', nullable: true })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<UserType | null> {
    const user = await this.findUserByIdUseCase.execute(id);
    return user ? this.toGraphQL(user) : null;
  }

  @Query(() => [UserType], { name: 'usersByRole' })
  async findByRole(
    @Args('role', { type: () => UserRoleEnum }) role: UserRoleEnum,
  ): Promise<UserType[]> {
    const users = await this.findUsersByRoleUseCase.execute(UserRole[role]);
    return users.map((user) => this.toGraphQL(user));
  }

  @Query(() => [UserType], { name: 'homeowners' })
  async findHomeowners(): Promise<UserType[]> {
    const users = await this.findUsersByRoleUseCase.execute(UserRole.HOMEOWNER);
    return users.map((user) => this.toGraphQL(user));
  }

  @Query(() => [UserType], { name: 'contractors' })
  async findContractors(): Promise<UserType[]> {
    const users = await this.findUsersByRoleUseCase.execute(
      UserRole.CONTRACTOR,
    );
    return users.map((user) => this.toGraphQL(user));
  }

  @Mutation(() => UserType)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserType> {
    const user = await this.createUserUseCase.execute({
      email: input.email,
      name: input.name,
      role: UserRole[input.role],
    });
    return this.toGraphQL(user);
  }

  @Mutation(() => UserType)
  async updateUser(@Args('input') input: UpdateUserInput): Promise<UserType> {
    const user = await this.updateUserUseCase.execute(input.id, {
      name: input.name,
    });
    return this.toGraphQL(user);
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.deleteUserUseCase.execute(id);
    return true;
  }

  private toGraphQL(entity: {
    id: string;
    email: string;
    name: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }): UserType {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      role: entity.role as UserRoleEnum,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
