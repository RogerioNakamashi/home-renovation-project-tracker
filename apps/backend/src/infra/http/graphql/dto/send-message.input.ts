import { InputType, Field } from '@nestjs/graphql';
import { IsString, MaxLength } from 'class-validator';

@InputType()
export class SendMessageInput {
  @Field()
  @IsString()
  @MaxLength(2000)
  content: string;

  @Field()
  @IsString()
  jobId: string;

  @Field()
  @IsString()
  senderId: string;
}
