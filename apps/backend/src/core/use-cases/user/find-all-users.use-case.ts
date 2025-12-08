import { Inject, Injectable } from '@nestjs/common';
import { UserEntity } from '../../entities/user.entity';
import type { IUserRepository } from '../../repositories/user.repository';
import { USER_REPOSITORY } from '../../repositories/user.repository';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(): Promise<UserEntity[]> {
    return this.userRepository.findAll();
  }
}
