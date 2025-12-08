import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JobEntity } from '../../entities/job.entity';
import type { IJobRepository } from '../../repositories/job.repository';
import { JOB_REPOSITORY } from '../../repositories/job.repository';

export interface UpdateJobInput {
  description?: string;
  address?: string;
}

@Injectable()
export class UpdateJobUseCase {
  constructor(
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(id: string, input: UpdateJobInput): Promise<JobEntity> {
    const job = await this.jobRepository.findById(id);

    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    const updatedJob = job.update(input);

    return this.jobRepository.update(updatedJob);
  }
}
