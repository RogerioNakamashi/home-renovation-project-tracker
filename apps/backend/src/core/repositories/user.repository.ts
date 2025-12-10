import { Injectable } from '@nestjs/common';
import { UserEntity, UserRole } from '../entities/user.entity';
import { PrismaService } from '../../infra/database/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: UserEntity): Promise<UserEntity> {
    const created = await this.prisma.user.create({
      data: {
        id: entity.id,
        email: entity.email,
        name: entity.name,
        passwordHash: entity.passwordHash,
        role: entity.role,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map((user) => this.toDomain(user));
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return this.toDomain(user);
  }

  async findByRole(role: UserRole): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany({
      where: { role },
    });

    return users.map((user) => this.toDomain(user));
  }

  async update(entity: UserEntity): Promise<UserEntity> {
    const updated = await this.prisma.user.update({
      where: { id: entity.id },
      data: {
        name: entity.name,
        updatedAt: entity.updatedAt,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }

  private toDomain(raw: {
    id: string;
    email: string;
    name: string;
    passwordHash: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }): UserEntity {
    return UserEntity.create({
      id: raw.id,
      email: raw.email,
      name: raw.name,
      passwordHash: raw.passwordHash,
      role: raw.role as UserRole,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
