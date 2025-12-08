import { Inject, Injectable } from '@nestjs/common';
import { UserEntity, UserRole } from '../../entities/user.entity';
import type { IUserRepository } from '../../repositories/user.repository';
import { USER_REPOSITORY } from '../../repositories/user.repository';

@Injectable()
export class FindUsersByRoleUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(role: UserRole): Promise<UserEntity[]> {
    return this.userRepository.findByRole(role);
  }
}
