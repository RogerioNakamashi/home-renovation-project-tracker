import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { JobType, JobStatusEnum } from '../types/job.type';
import { UserType } from '../types/user.type';
import { CreateJobInput } from '../dto/create-job.input';
import { UpdateJobInput } from '../dto/update-job.input';
import { UpdateJobCostInput } from '../dto/update-job-cost.input';
import { UpdateJobStatusInput } from '../dto/update-job-status.input';
import { CreateJobUseCase } from '../../../../core/use-cases/job/create-job.use-case';
import { FindAllJobsUseCase } from '../../../../core/use-cases/job/find-all-jobs.use-case';
import { FindJobByIdUseCase } from '../../../../core/use-cases/job/find-job-by-id.use-case';
import { FindJobsByContractorUseCase } from '../../../../core/use-cases/job/find-jobs-by-contractor.use-case';
import { FindJobsByHomeownerUseCase } from '../../../../core/use-cases/job/find-jobs-by-homeowner.use-case';
import { UpdateJobUseCase } from '../../../../core/use-cases/job/update-job.use-case';
import { UpdateJobCostUseCase } from '../../../../core/use-cases/job/update-job-cost.use-case';
import { UpdateJobStatusUseCase } from '../../../../core/use-cases/job/update-job-status.use-case';
import { DeleteJobUseCase } from '../../../../core/use-cases/job/delete-job.use-case';
import { FindUserByIdUseCase } from '../../../../core/use-cases/user/find-user-by-id.use-case';
import { JobStatus } from '../../../../core/entities/job.entity';

@Resolver(() => JobType)
export class JobResolver {
  constructor(
    private readonly createJobUseCase: CreateJobUseCase,
    private readonly findAllJobsUseCase: FindAllJobsUseCase,
    private readonly findJobByIdUseCase: FindJobByIdUseCase,
    private readonly findJobsByContractorUseCase: FindJobsByContractorUseCase,
    private readonly findJobsByHomeownerUseCase: FindJobsByHomeownerUseCase,
    private readonly updateJobUseCase: UpdateJobUseCase,
    private readonly updateJobCostUseCase: UpdateJobCostUseCase,
    private readonly updateJobStatusUseCase: UpdateJobStatusUseCase,
    private readonly deleteJobUseCase: DeleteJobUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  @Query(() => [JobType], { name: 'jobs' })
  async findAll(): Promise<JobType[]> {
    const jobs = await this.findAllJobsUseCase.execute();
    return jobs.map((job) => this.toGraphQL(job));
  }

  @Query(() => JobType, { name: 'job', nullable: true })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<JobType | null> {
    const job = await this.findJobByIdUseCase.execute(id);
    return job ? this.toGraphQL(job) : null;
  }

  @Query(() => [JobType], { name: 'jobsByContractor' })
  async findByContractor(
    @Args('contractorId', { type: () => ID }) contractorId: string,
  ): Promise<JobType[]> {
    const jobs = await this.findJobsByContractorUseCase.execute(contractorId);
    return jobs.map((job) => this.toGraphQL(job));
  }

  @Query(() => [JobType], { name: 'jobsByHomeowner' })
  async findByHomeowner(
    @Args('homeownerId', { type: () => ID }) homeownerId: string,
  ): Promise<JobType[]> {
    const jobs = await this.findJobsByHomeownerUseCase.execute(homeownerId);
    return jobs.map((job) => this.toGraphQL(job));
  }

  @Mutation(() => JobType)
  async createJob(@Args('input') input: CreateJobInput): Promise<JobType> {
    const job = await this.createJobUseCase.execute({
      description: input.description,
      address: input.address,
      contractorId: input.contractorId,
      homeownerId: input.homeownerId,
      cost: input.cost,
    });
    return this.toGraphQL(job);
  }

  @Mutation(() => JobType)
  async updateJob(@Args('input') input: UpdateJobInput): Promise<JobType> {
    const job = await this.updateJobUseCase.execute(input.id, {
      description: input.description,
      address: input.address,
    });
    return this.toGraphQL(job);
  }

  @Mutation(() => JobType)
  async updateJobCost(
    @Args('input') input: UpdateJobCostInput,
  ): Promise<JobType> {
    const job = await this.updateJobCostUseCase.execute(
      input.jobId,
      input.cost,
      input.contractorId,
    );
    return this.toGraphQL(job);
  }

  @Mutation(() => JobType)
  async updateJobStatus(
    @Args('input') input: UpdateJobStatusInput,
  ): Promise<JobType> {
    const job = await this.updateJobStatusUseCase.execute(
      input.jobId,
      JobStatus[input.status],
    );
    return this.toGraphQL(job);
  }

  @Mutation(() => Boolean)
  async deleteJob(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.deleteJobUseCase.execute(id);
    return true;
  }

  @ResolveField(() => UserType, { nullable: true })
  async contractor(@Parent() job: JobType): Promise<UserType | null> {
    const user = await this.findUserByIdUseCase.execute(job.contractorId);
    return user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as any,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      : null;
  }

  @ResolveField(() => UserType, { nullable: true })
  async homeowner(@Parent() job: JobType): Promise<UserType | null> {
    const user = await this.findUserByIdUseCase.execute(job.homeownerId);
    return user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as any,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      : null;
  }

  private toGraphQL(entity: {
    id: string;
    description: string;
    address: string;
    status: string;
    cost: number;
    contractorId: string;
    homeownerId: string;
    createdAt: Date;
    updatedAt: Date;
  }): JobType {
    return {
      id: entity.id,
      description: entity.description,
      address: entity.address,
      status: entity.status as JobStatusEnum,
      cost: entity.cost,
      contractorId: entity.contractorId,
      homeownerId: entity.homeownerId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
