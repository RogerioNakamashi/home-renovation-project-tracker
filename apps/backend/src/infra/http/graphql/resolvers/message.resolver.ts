import {
  Resolver,
  Query,
  Mutation,
  Args,
  ID,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { MessageType } from '../types/message.type';
import { UserType } from '../types/user.type';
import { SendMessageInput } from '../dto/send-message.input';
import { SendMessageUseCase } from '../../../../core/use-cases/message/send-message.use-case';
import { FindMessagesByJobUseCase } from '../../../../core/use-cases/message/find-messages-by-job.use-case';
import { FindUserByIdUseCase } from '../../../../core/use-cases/user/find-user-by-id.use-case';

@Resolver(() => MessageType)
export class MessageResolver {
  constructor(
    private readonly sendMessageUseCase: SendMessageUseCase,
    private readonly findMessagesByJobUseCase: FindMessagesByJobUseCase,
    private readonly findUserByIdUseCase: FindUserByIdUseCase,
  ) {}

  @Query(() => [MessageType], { name: 'messagesByJob' })
  async findByJob(
    @Args('jobId', { type: () => ID }) jobId: string,
  ): Promise<MessageType[]> {
    const messages = await this.findMessagesByJobUseCase.execute(jobId);
    return messages.map((message) => this.toGraphQL(message));
  }

  @Mutation(() => MessageType)
  async sendMessage(
    @Args('input') input: SendMessageInput,
  ): Promise<MessageType> {
    const message = await this.sendMessageUseCase.execute({
      content: input.content,
      jobId: input.jobId,
      senderId: input.senderId,
    });
    return this.toGraphQL(message);
  }

  @ResolveField(() => UserType, { nullable: true })
  async sender(@Parent() message: MessageType): Promise<UserType | null> {
    const user = await this.findUserByIdUseCase.execute(message.senderId);
    return user
      ? {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as any,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      : null;
  }

  private toGraphQL(entity: {
    id: string;
    content: string;
    jobId: string;
    senderId: string;
    createdAt: Date;
  }): MessageType {
    return {
      id: entity.id,
      content: entity.content,
      jobId: entity.jobId,
      senderId: entity.senderId,
      createdAt: entity.createdAt,
    };
  }
}
