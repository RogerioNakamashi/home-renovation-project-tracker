import {
  ObjectType,
  Field,
  ID,
  Float,
  registerEnumType,
} from '@nestjs/graphql';
import { UserType } from './user.type';
import { SubtaskType } from './subtask.type';

export enum JobStatusEnum {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

registerEnumType(JobStatusEnum, {
  name: 'JobStatus',
  description: 'The status of a job',
});

@ObjectType()
export class JobType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  address: string;

  @Field(() => JobStatusEnum)
  status: JobStatusEnum;

  @Field(() => Float)
  cost: number;

  @Field()
  contractorId: string;

  @Field()
  homeownerId: string;

  @Field(() => UserType, { nullable: true })
  contractor?: UserType;

  @Field(() => UserType, { nullable: true })
  homeowner?: UserType;

  @Field(() => [SubtaskType], { nullable: true })
  subtasks?: SubtaskType[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
