import { Injectable } from '@nestjs/common';
import type { IJobRepository } from '../../../core/repositories/job.repository';
import { JobEntity, JobStatus } from '../../../core/entities/job.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaJobRepository implements IJobRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(entity: JobEntity): Promise<JobEntity> {
    const created = await this.prisma.job.create({
      data: {
        id: entity.id,
        description: entity.description,
        address: entity.address,
        status: entity.status,
        cost: entity.cost,
        contractorId: entity.contractorId,
        homeownerId: entity.homeownerId,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      },
    });

    return this.toDomain(created);
  }

  async findAll(): Promise<JobEntity[]> {
    const jobs = await this.prisma.job.findMany();
    return jobs.map((job) => this.toDomain(job));
  }

  async findById(id: string): Promise<JobEntity | null> {
    const job = await this.prisma.job.findUnique({
      where: { id },
    });

    if (!job) {
      return null;
    }

    return this.toDomain(job);
  }

  async findByContractorId(contractorId: string): Promise<JobEntity[]> {
    const jobs = await this.prisma.job.findMany({
      where: { contractorId },
    });

    return jobs.map((job) => this.toDomain(job));
  }

  async findByHomeownerId(homeownerId: string): Promise<JobEntity[]> {
    const jobs = await this.prisma.job.findMany({
      where: { homeownerId },
    });

    return jobs.map((job) => this.toDomain(job));
  }

  async findByStatus(status: JobStatus): Promise<JobEntity[]> {
    const jobs = await this.prisma.job.findMany({
      where: { status },
    });

    return jobs.map((job) => this.toDomain(job));
  }

  async update(entity: JobEntity): Promise<JobEntity> {
    const updated = await this.prisma.job.update({
      where: { id: entity.id },
      data: {
        description: entity.description,
        address: entity.address,
        status: entity.status,
        cost: entity.cost,
        updatedAt: entity.updatedAt,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.job.delete({
      where: { id },
    });
  }

  private toDomain(raw: {
    id: string;
    description: string;
    address: string;
    status: string;
    cost: number;
    contractorId: string;
    homeownerId: string;
    createdAt: Date;
    updatedAt: Date;
  }): JobEntity {
    return JobEntity.create({
      id: raw.id,
      description: raw.description,
      address: raw.address,
      status: raw.status as JobStatus,
      cost: raw.cost,
      contractorId: raw.contractorId,
      homeownerId: raw.homeownerId,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
