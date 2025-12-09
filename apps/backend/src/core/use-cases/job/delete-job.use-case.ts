import { Injectable, NotFoundException } from '@nestjs/common';
import { JobRepository } from '../../repositories/job.repository';

@Injectable()
export class DeleteJobUseCase {
  constructor(private readonly jobRepository: JobRepository) {}

  async execute(id: string): Promise<void> {
    const job = await this.jobRepository.findById(id);

    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    await this.jobRepository.delete(id);
  }
}
