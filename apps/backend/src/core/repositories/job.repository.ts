import type { JobEntity, JobStatus } from '../entities/job.entity';

export abstract class JobRepository {
  abstract create(entity: JobEntity): Promise<JobEntity>;
  abstract findAll(): Promise<JobEntity[]>;
  abstract findById(id: string): Promise<JobEntity | null>;
  abstract findByContractorId(contractorId: string): Promise<JobEntity[]>;
  abstract findByHomeownerId(homeownerId: string): Promise<JobEntity[]>;
  abstract findByStatus(status: JobStatus): Promise<JobEntity[]>;
  abstract update(entity: JobEntity): Promise<JobEntity>;
  abstract delete(id: string): Promise<void>;
}
