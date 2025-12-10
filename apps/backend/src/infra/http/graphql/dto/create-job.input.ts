import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
} from 'class-validator';

@InputType()
export class CreateJobInput {
  @Field()
  @IsString()
  @MaxLength(255)
  name: string;

  @Field()
  @IsString()
  @MaxLength(1000)
  description: string;

  @Field()
  @IsString()
  @MaxLength(500)
  address: string;

  @Field()
  @IsString()
  contractorId: string;

  @Field()
  @IsString()
  homeownerId: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;
}
