import { Injectable, NotFoundException } from '@nestjs/common';
import { JobEntity, JobStatus } from '../../entities/job.entity';
import { JobRepository } from '../../repositories/job.repository';

@Injectable()
export class UpdateJobStatusUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(id: string, status: JobStatus): Promise<JobEntity> {
    const job = await this.jobRepository.findById(id);

    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    const updatedJob = job.update({ status });

    return this.jobRepository.update(updatedJob);
  }
}
