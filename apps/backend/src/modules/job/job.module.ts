import { Module } from '@nestjs/common';
import { JobResolver } from '../../infra/http/graphql/resolvers/job.resolver';
import { JobRepository } from '../../core/repositories/job.repository';
import { SubtaskRepository } from '../../core/repositories/subtask.repository';
import { CreateJobUseCase } from '../../core/use-cases/job/create-job.use-case';
import { FindAllJobsUseCase } from '../../core/use-cases/job/find-all-jobs.use-case';
import { FindJobByIdUseCase } from '../../core/use-cases/job/find-job-by-id.use-case';
import { FindJobsByContractorUseCase } from '../../core/use-cases/job/find-jobs-by-contractor.use-case';
import { FindJobsByHomeownerUseCase } from '../../core/use-cases/job/find-jobs-by-homeowner.use-case';
import { UpdateJobUseCase } from '../../core/use-cases/job/update-job.use-case';
import { UpdateJobCostUseCase } from '../../core/use-cases/job/update-job-cost.use-case';
import { UpdateJobStatusUseCase } from '../../core/use-cases/job/update-job-status.use-case';
import { DeleteJobUseCase } from '../../core/use-cases/job/delete-job.use-case';
import { UserModule } from '../user/user.module';
import { CreateSubtaskUseCase } from '../../core/use-cases/subtask';

@Module({
  imports: [UserModule],
  providers: [
    JobResolver,
    JobRepository,
    SubtaskRepository,
    CreateJobUseCase,
    CreateSubtaskUseCase,
    FindAllJobsUseCase,
    FindJobByIdUseCase,
    FindJobsByContractorUseCase,
    FindJobsByHomeownerUseCase,
    UpdateJobUseCase,
    UpdateJobCostUseCase,
    UpdateJobStatusUseCase,
    DeleteJobUseCase,
  ],
  exports: [JobRepository],
})
export class JobModule {}
