import { Injectable } from '@nestjs/common';
import { UserEntity, UserRole } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';

export interface CreateUserInput {
  email: string;
  name: string;
  role: UserRole;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

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
