import { Injectable } from '@nestjs/common';
import type { IExampleRepository } from '../../../core/repositories/example.repository';
import { ExampleEntity } from '../../../core/entities/example.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaExampleRepository implements IExampleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: ExampleEntity): Promise<ExampleEntity> {
    const created = await this.prisma.example.create({
      data: {
        id: entity.id,
        name: entity.name,
        description: entity.description,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async findAll(): Promise<ExampleEntity[]> {
    const examples = await this.prisma.example.findMany();
    return examples.map((example) => this.toDomain(example));
  }

  async findById(id: string): Promise<ExampleEntity | null> {
    const example = await this.prisma.example.findUnique({
      where: { id },
    });

    if (!example) {
      return null;
    }

    return this.toDomain(example);
  }

  async update(entity: ExampleEntity): Promise<ExampleEntity> {
    const updated = await this.prisma.example.update({
      where: { id: entity.id },
      data: {
        name: entity.name,
        description: entity.description,
        updatedAt: entity.updatedAt,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.example.delete({
      where: { id },
    });
  }

  private toDomain(raw: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
  }): ExampleEntity {
    return ExampleEntity.create({
      id: raw.id,
      name: raw.name,
      description: raw.description ?? undefined,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
