import { Inject, Injectable } from '@nestjs/common';
import { JobEntity } from '../../entities/job.entity';
import type { IJobRepository } from '../../repositories/job.repository';
import { JOB_REPOSITORY } from '../../repositories/job.repository';

@Injectable()
export class FindJobsByHomeownerUseCase {
  constructor(
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(homeownerId: string): Promise<JobEntity[]> {
    return this.jobRepository.findByHomeownerId(homeownerId);
  }
}
