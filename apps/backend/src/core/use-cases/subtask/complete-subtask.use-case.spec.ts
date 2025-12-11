import { CompleteSubtaskUseCase } from './complete-subtask.use-case';
import { SubtaskEntity, SubtaskStatus } from '../../entities/subtask.entity';
import { NotFoundException } from '@nestjs/common';

describe('CompleteSubtaskUseCase', () => {
  it('throws NotFoundException when subtask does not exist', async () => {
    const mockRepo = { findById: jest.fn().mockResolvedValue(null) };
    const useCase = new CompleteSubtaskUseCase(mockRepo as any);

    await expect(useCase.execute('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
    expect(mockRepo.findById).toHaveBeenCalledWith('missing-id');
  });

  it('completes an existing subtask and updates repository', async () => {
    const existing = SubtaskEntity.create({
      jobId: 'job-1',
      description: 'Tile floor',
      cost: 200,
    });

    const updated = existing.complete();

    const mockRepo = {
      findById: jest.fn().mockResolvedValue(existing),
      update: jest.fn().mockResolvedValue(updated),
    };

    const useCase = new CompleteSubtaskUseCase(mockRepo as any);
    const result = await useCase.execute(existing.id);

    expect(mockRepo.findById).toHaveBeenCalledWith(existing.id);
    expect(mockRepo.update).toHaveBeenCalled();
    expect(result.status).toBe(SubtaskStatus.COMPLETED);
  });
});
