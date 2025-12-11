import { CreateJobUseCase } from './create-job.use-case';
import { JobEntity } from '../../entities/job.entity';
import { UserEntity, UserRole } from '../../entities/user.entity';

describe('CreateJobUseCase', () => {
  it('creates a job and creates subtasks when provided', async () => {
    const contractor = UserEntity.create({
      email: 'c@example.com',
      name: 'Contractor',
      passwordHash: 'hash',
      role: UserRole.CONTRACTOR,
    });

    const homeowner = UserEntity.create({
      email: 'h@example.com',
      name: 'Homeowner',
      passwordHash: 'hash',
      role: UserRole.HOMEOWNER,
    });

    const createdJob = JobEntity.create({
      name: 'Kitchen',
      description: 'Remodel kitchen',
      address: '123 Main St',
      contractorId: contractor.id,
      homeownerId: homeowner.id,
    });

    const mockJobRepo = { create: jest.fn().mockResolvedValue(createdJob) };
    const mockUserRepo = {
      findById: jest.fn().mockImplementation(async (id) => {
        if (id === contractor.id) return contractor;
        if (id === homeowner.id) return homeowner;
        return null;
      }),
    };

    const mockCreateSubtask = { execute: jest.fn().mockResolvedValue(null) };

    const useCase = new CreateJobUseCase(
      mockJobRepo as any,
      mockUserRepo as any,
      mockCreateSubtask as any,
    );

    const input = {
      name: 'Kitchen',
      description: 'Remodel kitchen',
      address: '123 Main St',
      contractorId: contractor.id,
      homeownerId: homeowner.id,
      subtasks: [
        {
          description: 'Remove cabinets',
          deadline: '2025-02-01T00:00:00.000Z',
          cost: 100,
        },
        { description: 'Install countertops', cost: 500 },
      ],
    };

    const result = await useCase.execute(input as any);

    expect(mockUserRepo.findById).toHaveBeenCalledWith(contractor.id);
    expect(mockUserRepo.findById).toHaveBeenCalledWith(homeowner.id);
    expect(mockJobRepo.create).toHaveBeenCalled();
    // createSubtask.execute should be called for each provided subtask
    expect(mockCreateSubtask.execute).toHaveBeenCalledTimes(2);
    expect(result).toBe(createdJob);
  });
});
