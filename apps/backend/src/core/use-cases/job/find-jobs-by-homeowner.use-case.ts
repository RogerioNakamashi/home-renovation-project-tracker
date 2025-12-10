import { Injectable } from '@nestjs/common';
import { JobEntity } from '../../entities/job.entity';
import { JobRepository } from '../../repositories/job.repository';

@Injectable()
export class FindJobsByHomeownerUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(homeownerId: string): Promise<JobEntity[]> {
    return this.jobRepository.findByHomeownerId(homeownerId);
  }
}
