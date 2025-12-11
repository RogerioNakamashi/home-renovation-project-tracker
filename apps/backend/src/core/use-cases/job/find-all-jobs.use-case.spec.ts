import { FindAllJobsUseCase } from './find-all-jobs.use-case';
import { JobEntity } from '../../entities/job.entity';

describe('FindAllJobsUseCase', () => {
  it('returns all jobs', async () => {
    const j1 = JobEntity.create({
      name: 'A',
      description: 'd',
      address: 'a',
      contractorId: 'c1',
      homeownerId: 'h1',
    });

    const mockRepo = { findAll: jest.fn().mockResolvedValue([j1]) };
    const uc = new FindAllJobsUseCase(mockRepo as any);

    const res = await uc.execute();
    expect(mockRepo.findAll).toHaveBeenCalled();
    expect(res).toEqual([j1]);
  });
});
