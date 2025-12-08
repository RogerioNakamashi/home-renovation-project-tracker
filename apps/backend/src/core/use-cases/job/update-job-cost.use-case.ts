import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JobEntity } from '../../entities/job.entity';
import type { IJobRepository } from '../../repositories/job.repository';
import { JOB_REPOSITORY } from '../../repositories/job.repository';

@Injectable()
export class UpdateJobCostUseCase {
  constructor(
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(
    id: string,
    cost: number,
    contractorId: string,
  ): Promise<JobEntity> {
    const job = await this.jobRepository.findById(id);

    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    if (job.contractorId !== contractorId) {
      throw new ForbiddenException(
        'Only the assigned contractor can update the cost',
      );
    }

    const updatedJob = job.updateCost(cost);

    return this.jobRepository.update(updatedJob);
  }
}
