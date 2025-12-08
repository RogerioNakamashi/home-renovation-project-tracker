import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IJobRepository } from '../../repositories/job.repository';
import { JOB_REPOSITORY } from '../../repositories/job.repository';

@Injectable()
export class DeleteJobUseCase {
  constructor(
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const job = await this.jobRepository.findById(id);

    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    await this.jobRepository.delete(id);
  }
}
