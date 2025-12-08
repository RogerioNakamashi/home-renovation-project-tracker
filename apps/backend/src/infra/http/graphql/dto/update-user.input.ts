import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsOptional, MaxLength } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;
}
