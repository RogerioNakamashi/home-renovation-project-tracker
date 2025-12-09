import type { UserEntity, UserRole } from '../entities/user.entity';

export abstract class UserRepository {
  abstract create(entity: UserEntity): Promise<UserEntity>;
  abstract findAll(): Promise<UserEntity[]>;
  abstract findById(id: string): Promise<UserEntity | null>;
  abstract findByEmail(email: string): Promise<UserEntity | null>;
  abstract findByRole(role: UserRole): Promise<UserEntity[]>;
  abstract update(entity: UserEntity): Promise<UserEntity>;
  abstract delete(id: string): Promise<void>;
}
