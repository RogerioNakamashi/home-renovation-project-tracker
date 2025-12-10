import { Injectable } from '@nestjs/common';
import { JobEntity } from '../../entities/job.entity';
import { JobRepository } from '../../repositories/job.repository';

@Injectable()
export class FindJobByIdUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(id: string): Promise<JobEntity | null> {
    return this.jobRepository.findById(id);
  }
}
