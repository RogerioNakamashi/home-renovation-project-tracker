import { Injectable } from '@nestjs/common';
import { SubtaskRepository } from '../../repositories/subtask.repository';
import { SubtaskEntity } from '../../entities/subtask.entity';

export interface CreateSubtaskInput {
  jobId: string;
  description: string;
  deadline?: Date | null;
  cost?: number;
}

@Injectable()
export class CreateSubtaskUseCase {
  constructor(private readonly subtaskRepository: SubtaskRepository) {}

  async execute(input: CreateSubtaskInput): Promise<SubtaskEntity> {
    const entity = SubtaskEntity.create({
      jobId: input.jobId,
      description: input.description,
      deadline: input.deadline ?? null,
      cost: input.cost ?? 0,
    });

    return this.subtaskRepository.create(entity);
  }
}
