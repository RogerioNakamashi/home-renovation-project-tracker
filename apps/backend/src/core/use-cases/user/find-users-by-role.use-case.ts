import { Injectable } from '@nestjs/common';
import { UserEntity, UserRole } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';

@Injectable()
export class FindUsersByRoleUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(role: UserRole): Promise<UserEntity[]> {
    return this.userRepository.findByRole(role);
  }
}
