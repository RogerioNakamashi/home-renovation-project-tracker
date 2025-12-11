import { CreateSubtaskUseCase } from './create-subtask.use-case';
import { SubtaskEntity } from '../../entities/subtask.entity';

describe('CreateSubtaskUseCase', () => {
  it('creates a subtask and returns the entity', async () => {
    const mockRepo = { create: jest.fn().mockImplementation(async (e) => e) };
    const useCase = new CreateSubtaskUseCase(mockRepo as any);

    const input = {
      jobId: 'job-1',
      description: 'Paint walls',
      deadline: new Date('2025-01-01T00:00:00.000Z'),
      cost: 150,
    };

    const result = await useCase.execute(input);

    expect(mockRepo.create).toHaveBeenCalledTimes(1);
    expect(result).toBeInstanceOf(SubtaskEntity);
    expect(result.jobId).toBe(input.jobId);
    expect(result.description).toBe(input.description);
    expect(result.cost).toBe(input.cost);
  });
});
