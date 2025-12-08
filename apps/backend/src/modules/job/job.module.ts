import { Module } from '@nestjs/common';
import { JobResolver } from '../../infra/http/graphql/resolvers/job.resolver';
import { PrismaJobRepository } from '../../infra/database/prisma/prisma-job.repository';
import { CreateJobUseCase } from '../../core/use-cases/job/create-job.use-case';
import { FindAllJobsUseCase } from '../../core/use-cases/job/find-all-jobs.use-case';
import { FindJobByIdUseCase } from '../../core/use-cases/job/find-job-by-id.use-case';
import { FindJobsByContractorUseCase } from '../../core/use-cases/job/find-jobs-by-contractor.use-case';
import { FindJobsByHomeownerUseCase } from '../../core/use-cases/job/find-jobs-by-homeowner.use-case';
import { UpdateJobUseCase } from '../../core/use-cases/job/update-job.use-case';
import { UpdateJobCostUseCase } from '../../core/use-cases/job/update-job-cost.use-case';
import { UpdateJobStatusUseCase } from '../../core/use-cases/job/update-job-status.use-case';
import { DeleteJobUseCase } from '../../core/use-cases/job/delete-job.use-case';
import { FindUserByIdUseCase } from '../../core/use-cases/user/find-user-by-id.use-case';
import { JOB_REPOSITORY } from '../../core/repositories/job.repository';
import { USER_REPOSITORY } from '../../core/repositories/user.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  providers: [
    JobResolver,
    {
      provide: JOB_REPOSITORY,
      useClass: PrismaJobRepository,
    },
    {
      provide: CreateJobUseCase,
      useFactory: (repository) => new CreateJobUseCase(repository),
      inject: [JOB_REPOSITORY],
    },
    {
      provide: FindAllJobsUseCase,
      useFactory: (repository) => new FindAllJobsUseCase(repository),
      inject: [JOB_REPOSITORY],
    },
    {
      provide: FindJobByIdUseCase,
      useFactory: (repository) => new FindJobByIdUseCase(repository),
      inject: [JOB_REPOSITORY],
    },
    {
      provide: FindJobsByContractorUseCase,
      useFactory: (repository) => new FindJobsByContractorUseCase(repository),
      inject: [JOB_REPOSITORY],
    },
    {
      provide: FindJobsByHomeownerUseCase,
      useFactory: (repository) => new FindJobsByHomeownerUseCase(repository),
      inject: [JOB_REPOSITORY],
    },
    {
      provide: UpdateJobUseCase,
      useFactory: (repository) => new UpdateJobUseCase(repository),
      inject: [JOB_REPOSITORY],
    },
    {
      provide: UpdateJobCostUseCase,
      useFactory: (repository) => new UpdateJobCostUseCase(repository),
      inject: [JOB_REPOSITORY],
    },
    {
      provide: UpdateJobStatusUseCase,
      useFactory: (repository) => new UpdateJobStatusUseCase(repository),
      inject: [JOB_REPOSITORY],
    },
    {
      provide: DeleteJobUseCase,
      useFactory: (repository) => new DeleteJobUseCase(repository),
      inject: [JOB_REPOSITORY],
    },
    {
      provide: FindUserByIdUseCase,
      useFactory: (repository) => new FindUserByIdUseCase(repository),
      inject: [USER_REPOSITORY],
    },
  ],
  exports: [JOB_REPOSITORY],
})
export class JobModule {}
