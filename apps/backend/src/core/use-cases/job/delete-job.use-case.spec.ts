import { DeleteJobUseCase } from './delete-job.use-case';
import { JobEntity } from '../../entities/job.entity';
import { NotFoundException } from '@nestjs/common';

describe('DeleteJobUseCase', () => {
  it('throws when job not found', async () => {
    const mockRepo = { findById: jest.fn().mockResolvedValue(null) };
    const uc = new DeleteJobUseCase(mockRepo as any);

    await expect(uc.execute('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('deletes job when found', async () => {
    const job = JobEntity.create({
      name: 'X',
      description: 'd',
      address: 'a',
      contractorId: 'c1',
      homeownerId: 'h1',
    });

    const mockRepo = {
      findById: jest.fn().mockResolvedValue(job),
      delete: jest.fn().mockResolvedValue(undefined),
    };

    const uc = new DeleteJobUseCase(mockRepo as any);
    await uc.execute(job.id);

    expect(mockRepo.findById).toHaveBeenCalledWith(job.id);
    expect(mockRepo.delete).toHaveBeenCalledWith(job.id);
  });
});
