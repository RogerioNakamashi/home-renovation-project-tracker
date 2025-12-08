import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { JobEntity, JobStatus } from '../../entities/job.entity';
import type { IJobRepository } from '../../repositories/job.repository';
import { JOB_REPOSITORY } from '../../repositories/job.repository';

@Injectable()
export class UpdateJobStatusUseCase {
  constructor(
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(id: string, status: JobStatus): Promise<JobEntity> {
    const job = await this.jobRepository.findById(id);

    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    const updatedJob = job.update({ status });

    return this.jobRepository.update(updatedJob);
  }
}
