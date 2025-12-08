import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../entities/user.entity';
import type { IUserRepository } from '../../repositories/user.repository';
import { USER_REPOSITORY } from '../../repositories/user.repository';

export interface UpdateUserInput {
  name?: string;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(id: string, input: UpdateUserInput): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const updatedUser = user.update(input);

    return this.userRepository.update(updatedUser);
  }
}
