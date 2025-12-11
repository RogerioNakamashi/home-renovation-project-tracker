import { FindJobByIdUseCase } from './find-job-by-id.use-case';
import { JobEntity } from '../../entities/job.entity';

describe('FindJobByIdUseCase', () => {
  it('returns job when found', async () => {
    const job = JobEntity.create({
      name: 'Test',
      description: 'desc',
      address: 'addr',
      contractorId: 'c1',
      homeownerId: 'h1',
    });

    const mockRepo = { findById: jest.fn().mockResolvedValue(job) };
    const useCase = new FindJobByIdUseCase(mockRepo as any);

    const result = await useCase.execute(job.id);
    expect(mockRepo.findById).toHaveBeenCalledWith(job.id);
    expect(result).toBe(job);
  });

  it('returns null when not found', async () => {
    const mockRepo = { findById: jest.fn().mockResolvedValue(null) };
    const useCase = new FindJobByIdUseCase(mockRepo as any);

    const result = await useCase.execute('missing');
    expect(result).toBeNull();
  });
});
