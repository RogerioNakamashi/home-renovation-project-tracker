import type { UserEntity, UserRole } from '../entities/user.entity';

export interface IUserRepository {
  create(entity: UserEntity): Promise<UserEntity>;
  findAll(): Promise<UserEntity[]>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findByRole(role: UserRole): Promise<UserEntity[]>;
  update(entity: UserEntity): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
