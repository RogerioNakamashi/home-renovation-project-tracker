import { Inject, Injectable } from '@nestjs/common';
import { UserEntity, UserRole } from '../../entities/user.entity';
import type { IUserRepository } from '../../repositories/user.repository';
import { USER_REPOSITORY } from '../../repositories/user.repository';

export interface CreateUserInput {
  email: string;
  name: string;
  role: UserRole;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(input: CreateUserInput): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = UserEntity.create({
      email: input.email,
      name: input.name,
      role: input.role,
    });

    return this.userRepository.create(user);
  }
}
