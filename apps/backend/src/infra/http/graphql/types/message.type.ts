import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserType } from './user.type';

@ObjectType()
export class MessageType {
  @Field(() => ID)
  id: string;

  @Field()
  content: string;

  @Field()
  jobId: string;

  @Field()
  senderId: string;

  @Field(() => UserType, { nullable: true })
  sender?: UserType;

  @Field()
  createdAt: Date;
}
