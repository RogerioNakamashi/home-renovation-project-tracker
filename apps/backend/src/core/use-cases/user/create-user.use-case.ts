import { Injectable, ConflictException } from '@nestjs/common';
import { UserEntity, UserRole } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { HashService } from '../../services/hash.service';

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
  ) {}

  async execute(input: CreateUserInput): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(input.email);

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const passwordHash = await this.hashService.hash(input.password);

    const user = UserEntity.create({
      email: input.email,
      name: input.name,
      passwordHash,
      role: input.role,
    });

    return this.userRepository.create(user);
  }
}
