import { Injectable, NotFoundException } from '@nestjs/common';
import { SubtaskRepository } from '../../repositories/subtask.repository';
import { SubtaskEntity } from '../../entities/subtask.entity';

@Injectable()
export class CompleteSubtaskUseCase {
  constructor(private readonly subtaskRepository: SubtaskRepository) {}

  async execute(subtaskId: string): Promise<SubtaskEntity> {
    const existing = await this.subtaskRepository.findById(subtaskId);
    if (!existing) {
      throw new NotFoundException(`Subtask with id ${subtaskId} not found`);
    }

    const completed = existing.complete();
    return this.subtaskRepository.update(completed);
  }
}
