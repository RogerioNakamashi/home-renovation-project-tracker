import {
  ObjectType,
  Field,
  ID,
  Float,
  GraphQLISODateTime,
} from '@nestjs/graphql';

@ObjectType()
export class SubtaskType {
  @Field(() => ID)
  id: string;

  @Field()
  jobId: string;

  @Field()
  description: string;

  @Field(() => GraphQLISODateTime, { nullable: true })
  deadline?: Date | null;

  @Field(() => Float)
  cost: number;

  @Field()
  status: string;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
