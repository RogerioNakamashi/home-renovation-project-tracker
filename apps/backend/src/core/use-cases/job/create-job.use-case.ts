import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { JobEntity, JobStatus } from '../../entities/job.entity';
import { JobRepository } from '../../repositories/job.repository';
import { UserRepository } from '../../repositories/user.repository';
import { CreateSubtaskUseCase } from '../../use-cases/subtask/create-subtask.use-case';
import { UserRole } from '../../entities/user.entity';

export interface CreateJobInput {
  name: string;
  description: string;
  address: string;
  contractorId: string;
  homeownerId: string;
  cost?: number;
  subtasks?: Array<{ description: string; deadline?: string; cost?: number }>;
}

@Injectable()
export class CreateJobUseCase {
  constructor(
    private readonly jobRepository: JobRepository,
    private readonly userRepository: UserRepository,
    private readonly createSubtaskUseCase: CreateSubtaskUseCase,
  ) {}

  async execute(input: CreateJobInput): Promise<JobEntity> {
    const [contractor, homeowner] = await Promise.all([
      this.userRepository.findById(input.contractorId),
      this.userRepository.findById(input.homeownerId),
    ]);

    if (!contractor) {
      throw new NotFoundException(
        `Contractor with id ${input.contractorId} not found`,
      );
    }

    if (!homeowner) {
      throw new NotFoundException(
        `Homeowner with id ${input.homeownerId} not found`,
      );
    }

    if (contractor.role !== UserRole.CONTRACTOR) {
      throw new BadRequestException(
        `User ${input.contractorId} is not a contractor`,
      );
    }

    if (homeowner.role !== UserRole.HOMEOWNER) {
      throw new BadRequestException(
        `User ${input.homeownerId} is not a homeowner`,
      );
    }

    const job = JobEntity.create({
      name: input.name,
      description: input.description,
      address: input.address,
      contractorId: input.contractorId,
      homeownerId: input.homeownerId,
      cost: input.cost,
      status: JobStatus.PLANNING,
    });

    const createdJob = await this.jobRepository.create(job);

    // If subtasks provided, create them attached to the created job
    if (input.subtasks && input.subtasks.length) {
      await Promise.all(
        input.subtasks.map((s) =>
          this.createSubtaskUseCase.execute({
            jobId: createdJob.id,
            description: s.description,
            deadline: s.deadline ? new Date(s.deadline) : null,
            cost: s.cost ?? 0,
          }),
        ),
      );
    }

    return createdJob;
  }
}
