import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, IsNumber, Min } from 'class-validator';

@InputType()
export class UpdateJobCostInput {
  @Field()
  @IsString()
  jobId: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  cost: number;

  @Field()
  @IsString()
  contractorId: string;
}
