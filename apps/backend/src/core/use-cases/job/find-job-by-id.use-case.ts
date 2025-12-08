import { Inject, Injectable } from '@nestjs/common';
import { JobEntity } from '../../entities/job.entity';
import type { IJobRepository } from '../../repositories/job.repository';
import { JOB_REPOSITORY } from '../../repositories/job.repository';

@Injectable()
export class FindJobByIdUseCase {
  constructor(
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(id: string): Promise<JobEntity | null> {
    return this.jobRepository.findById(id);
  }
}
