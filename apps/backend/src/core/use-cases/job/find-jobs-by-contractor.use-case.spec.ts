import { FindJobsByContractorUseCase } from './find-jobs-by-contractor.use-case';
import { JobEntity } from '../../entities/job.entity';

describe('FindJobsByContractorUseCase', () => {
  it('returns jobs for contractor', async () => {
    const j1 = JobEntity.create({
      name: 'A',
      description: 'd',
      address: 'a',
      contractorId: 'c1',
      homeownerId: 'h1',
    });
    const mockRepo = { findByContractorId: jest.fn().mockResolvedValue([j1]) };
    const uc = new FindJobsByContractorUseCase(mockRepo as any);

    const res = await uc.execute('c1');
    expect(mockRepo.findByContractorId).toHaveBeenCalledWith('c1');
    expect(res).toEqual([j1]);
  });
});
