import type { JobEntity, JobStatus } from '../entities/job.entity';

export interface IJobRepository {
  create(entity: JobEntity): Promise<JobEntity>;
  findAll(): Promise<JobEntity[]>;
  findById(id: string): Promise<JobEntity | null>;
  findByContractorId(contractorId: string): Promise<JobEntity[]>;
  findByHomeownerId(homeownerId: string): Promise<JobEntity[]>;
  findByStatus(status: JobStatus): Promise<JobEntity[]>;
  update(entity: JobEntity): Promise<JobEntity>;
  delete(id: string): Promise<void>;
}

export const JOB_REPOSITORY = Symbol('JOB_REPOSITORY');
