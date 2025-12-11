import { Injectable } from '@nestjs/common';
import { SubtaskEntity, SubtaskStatus } from '../entities/subtask.entity';
import { PrismaService } from '../../infra/database/prisma/prisma.service';

@Injectable()
export class SubtaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: SubtaskEntity): Promise<SubtaskEntity> {
    const created = await this.prisma.subtask.create({
      data: {
        id: entity.id,
        jobId: entity.jobId,
        description: entity.description,
        status: entity.status,
        deadline: entity.deadline ?? null,
        cost: entity.cost,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async findByJobId(jobId: string): Promise<SubtaskEntity[]> {
    const rows = await this.prisma.subtask.findMany({
      where: { jobId },
      orderBy: { createdAt: 'asc' },
    });

    return rows.map((r) => this.toDomain(r));
  }

  async findById(id: string): Promise<SubtaskEntity | null> {
    const row = await this.prisma.subtask.findUnique({ where: { id } });
    if (!row) return null;
    return this.toDomain(row);
  }

  async update(entity: SubtaskEntity): Promise<SubtaskEntity> {
    const updated = await this.prisma.subtask.update({
      where: { id: entity.id },
      data: {
        description: entity.description,
        status: entity.status,
        deadline: entity.deadline ?? null,
        cost: entity.cost,
        updatedAt: entity.updatedAt,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subtask.delete({ where: { id } });
  }

  private toDomain(raw: {
    id: string;
    jobId: string;
    description: string;
    status: string;
    deadline: Date | null;
    cost: number;
    createdAt: Date;
    updatedAt: Date;
  }): SubtaskEntity {
    return SubtaskEntity.create({
      id: raw.id,
      jobId: raw.jobId,
      description: raw.description,
      deadline: raw.deadline ?? null,
      cost: raw.cost,
      status: raw.status as SubtaskStatus,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
