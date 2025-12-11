import { FindJobsByHomeownerUseCase } from './find-jobs-by-homeowner.use-case';
import { JobEntity } from '../../entities/job.entity';

describe('FindJobsByHomeownerUseCase', () => {
  it('returns jobs for homeowner', async () => {
    const j1 = JobEntity.create({
      name: 'A',
      description: 'd',
      address: 'a',
      contractorId: 'c1',
      homeownerId: 'h1',
    });
    const mockRepo = { findByHomeownerId: jest.fn().mockResolvedValue([j1]) };
    const uc = new FindJobsByHomeownerUseCase(mockRepo as any);

    const res = await uc.execute('h1');
    expect(mockRepo.findByHomeownerId).toHaveBeenCalledWith('h1');
    expect(res).toEqual([j1]);
  });
});
