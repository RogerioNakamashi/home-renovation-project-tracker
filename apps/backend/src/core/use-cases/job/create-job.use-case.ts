import { Inject, Injectable } from '@nestjs/common';
import { JobEntity, JobStatus } from '../../entities/job.entity';
import type { IJobRepository } from '../../repositories/job.repository';
import { JOB_REPOSITORY } from '../../repositories/job.repository';

export interface CreateJobInput {
  description: string;
  address: string;
  contractorId: string;
  homeownerId: string;
  cost?: number;
}

@Injectable()
export class CreateJobUseCase {
  constructor(
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(input: CreateJobInput): Promise<JobEntity> {
    const job = JobEntity.create({
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
