import { Injectable, NotFoundException } from '@nestjs/common';
import { JobEntity } from '../../entities/job.entity';
import { JobRepository } from '../../repositories/job.repository';

export interface UpdateJobInput {
  name?: string;
  description?: string;
  address?: string;
}

@Injectable()
export class UpdateJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(id: string, input: UpdateJobInput): Promise<JobEntity> {
    const job = await this.jobRepository.findById(id);

    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    const updatedJob = job.update(input);

    return this.jobRepository.update(updatedJob);
  }
}
