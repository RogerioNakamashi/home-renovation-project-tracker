import { Injectable } from '@nestjs/common';
import { JobEntity } from '../../entities/job.entity';
import { JobRepository } from '../../repositories/job.repository';

@Injectable()
export class FindJobsByContractorUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(contractorId: string): Promise<JobEntity[]> {
    return this.jobRepository.findByContractorId(contractorId);
  }
}
