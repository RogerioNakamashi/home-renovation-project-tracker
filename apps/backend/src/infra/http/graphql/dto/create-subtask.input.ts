import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsString,
  IsOptional,
  MaxLength,
  IsNumber,
  Min,
  IsDateString,
} from 'class-validator';

@InputType()
export class CreateSubtaskInput {
  @Field()
  @IsString()
  @MaxLength(1000)
  description: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;
}
