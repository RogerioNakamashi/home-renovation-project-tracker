import { Injectable } from '@nestjs/common';
import { JobEntity } from '../../entities/job.entity';
import { JobRepository } from '../../repositories/job.repository';

@Injectable()
export class FindAllJobsUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(): Promise<JobEntity[]> {
    return this.jobRepository.findAll();
  }
}
