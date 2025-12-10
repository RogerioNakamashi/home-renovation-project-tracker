import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsEnum } from 'class-validator';
import { JobStatusEnum } from '../types/job.type';

@InputType()
export class UpdateJobStatusInput {
  @Field()
  @IsString()
  jobId: string;

  @Field(() => JobStatusEnum)
  @IsEnum(JobStatusEnum)
  status: JobStatusEnum;
}
