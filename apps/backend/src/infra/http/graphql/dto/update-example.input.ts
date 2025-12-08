import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateExampleInput } from './create-example.input';

@InputType()
export class UpdateExampleInput extends PartialType(CreateExampleInput) {
  @Field()
  id: string;
}
