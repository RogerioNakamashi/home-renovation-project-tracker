import { UpdateJobStatusUseCase } from './update-job-status.use-case';
import { JobEntity, JobStatus } from '../../entities/job.entity';
import { NotFoundException } from '@nestjs/common';

describe('UpdateJobStatusUseCase', () => {
  it('throws when job not found', async () => {
    const mockRepo = { findById: jest.fn().mockResolvedValue(null) };
    const uc = new UpdateJobStatusUseCase(mockRepo as any);

    await expect(
      uc.execute('missing', JobStatus.IN_PROGRESS),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates status when found', async () => {
    const job = JobEntity.create({
      name: 'T',
      description: 'd',
      address: 'a',
      contractorId: 'c1',
      homeownerId: 'h1',
    });

    const updated = job.update({ status: JobStatus.IN_PROGRESS });

    const mockRepo = {
      findById: jest.fn().mockResolvedValue(job),
      update: jest.fn().mockResolvedValue(updated),
    };

    const uc = new UpdateJobStatusUseCase(mockRepo as any);
    const res = await uc.execute(job.id, JobStatus.IN_PROGRESS);

    expect(mockRepo.findById).toHaveBeenCalledWith(job.id);
    expect(mockRepo.update).toHaveBeenCalled();
    expect(res.status).toBe(JobStatus.IN_PROGRESS);
  });
});
