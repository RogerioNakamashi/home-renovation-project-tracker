import { UpdateJobUseCase } from './update-job.use-case';
import { JobEntity } from '../../entities/job.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateJobUseCase', () => {
  it('throws when job not found', async () => {
    const mockRepo = { findById: jest.fn().mockResolvedValue(null) };
    const uc = new UpdateJobUseCase(mockRepo as any);

    await expect(uc.execute('missing', { name: 'x' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates job when found', async () => {
    const job = JobEntity.create({
      name: 'Old',
      description: 'd',
      address: 'a',
      contractorId: 'c1',
      homeownerId: 'h1',
    });

    const updated = job.update({ name: 'New' });

    const mockRepo = {
      findById: jest.fn().mockResolvedValue(job),
      update: jest.fn().mockResolvedValue(updated),
    };

    const uc = new UpdateJobUseCase(mockRepo as any);
    const res = await uc.execute(job.id, { name: 'New' });

    expect(mockRepo.findById).toHaveBeenCalledWith(job.id);
    expect(mockRepo.update).toHaveBeenCalled();
    expect(res.name).toBe('New');
  });
});
