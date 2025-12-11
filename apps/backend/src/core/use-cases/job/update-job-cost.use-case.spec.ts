import { UpdateJobCostUseCase } from './update-job-cost.use-case';
import { JobEntity } from '../../entities/job.entity';
import { NotFoundException, ForbiddenException } from '@nestjs/common';

describe('UpdateJobCostUseCase', () => {
  it('throws NotFoundException when job missing', async () => {
    const mockRepo = { findById: jest.fn().mockResolvedValue(null) };
    const uc = new UpdateJobCostUseCase(mockRepo as any);

    await expect(uc.execute('id', 100, 'c1')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('throws ForbiddenException when contractor mismatch', async () => {
    const job = JobEntity.create({
      name: 'Test',
      description: 'd',
      address: 'a',
      contractorId: 'c-owner',
      homeownerId: 'h1',
    });

    const mockRepo = { findById: jest.fn().mockResolvedValue(job) };
    const uc = new UpdateJobCostUseCase(mockRepo as any);

    await expect(
      uc.execute(job.id, 200, 'other-contractor'),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('updates cost when valid', async () => {
    const job = JobEntity.create({
      name: 'Test',
      description: 'd',
      address: 'a',
      contractorId: 'c1',
      homeownerId: 'h1',
    });

    const updated = job.updateCost(300);

    const mockRepo = {
      findById: jest.fn().mockResolvedValue(job),
      update: jest.fn().mockResolvedValue(updated),
    };

    const uc = new UpdateJobCostUseCase(mockRepo as any);
    const res = await uc.execute(job.id, 300, 'c1');

    expect(mockRepo.findById).toHaveBeenCalledWith(job.id);
    expect(mockRepo.update).toHaveBeenCalled();
    expect(res.cost).toBe(300);
  });
});
