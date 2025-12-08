import { Module } from '@nestjs/common';
import { MessageResolver } from '../../infra/http/graphql/resolvers/message.resolver';
import { PrismaMessageRepository } from '../../infra/database/prisma/prisma-message.repository';
import { SendMessageUseCase } from '../../core/use-cases/message/send-message.use-case';
import { FindMessagesByJobUseCase } from '../../core/use-cases/message/find-messages-by-job.use-case';
import { FindUserByIdUseCase } from '../../core/use-cases/user/find-user-by-id.use-case';
import { MESSAGE_REPOSITORY } from '../../core/repositories/message.repository';
import { JOB_REPOSITORY } from '../../core/repositories/job.repository';
import { USER_REPOSITORY } from '../../core/repositories/user.repository';
import { JobModule } from '../job/job.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JobModule, UserModule],
  providers: [
    MessageResolver,
    {
      provide: MESSAGE_REPOSITORY,
      useClass: PrismaMessageRepository,
    },
    {
      provide: SendMessageUseCase,
      useFactory: (messageRepository, jobRepository) =>
        new SendMessageUseCase(messageRepository, jobRepository),
      inject: [MESSAGE_REPOSITORY, JOB_REPOSITORY],
    },
    {
      provide: FindMessagesByJobUseCase,
      useFactory: (repository) => new FindMessagesByJobUseCase(repository),
      inject: [MESSAGE_REPOSITORY],
    },
    {
      provide: FindUserByIdUseCase,
      useFactory: (repository) => new FindUserByIdUseCase(repository),
      inject: [USER_REPOSITORY],
    },
  ],
  exports: [MESSAGE_REPOSITORY],
})
export class MessageModule {}
