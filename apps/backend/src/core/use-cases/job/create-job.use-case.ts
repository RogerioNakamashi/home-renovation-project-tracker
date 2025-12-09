import { Injectable } from '@nestjs/common';
import { JobEntity, JobStatus } from '../../entities/job.entity';
import { JobRepository } from '../../repositories/job.repository';

export interface CreateJobInput {
  name: string;
  description: string;
  address: string;
  contractorId: string;
  homeownerId: string;
  cost?: number;
}

@Injectable()
export class CreateJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(input: CreateJobInput): Promise<JobEntity> {
    const job = JobEntity.create({
      name: input.name,
      description: input.description,
      address: input.address,
      contractorId: input.contractorId,
      homeownerId: input.homeownerId,
      cost: input.cost,
      status: JobStatus.PLANNING,
    });

    return this.jobRepository.create(job);
  }
}
