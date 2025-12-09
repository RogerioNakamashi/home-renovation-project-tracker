import { Module } from '@nestjs/common';
import { MessageResolver } from '../../infra/http/graphql/resolvers/message.resolver';
import { PrismaMessageRepository } from '../../infra/database/prisma/prisma-message.repository';
import { MessageRepository } from '../../core/repositories/message.repository';
import { SendMessageUseCase } from '../../core/use-cases/message/send-message.use-case';
import { FindMessagesByJobUseCase } from '../../core/use-cases/message/find-messages-by-job.use-case';
import { JobModule } from '../job/job.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JobModule, UserModule],
  providers: [
    MessageResolver,
    { provide: MessageRepository, useClass: PrismaMessageRepository },
    SendMessageUseCase,
    FindMessagesByJobUseCase,
  ],
  exports: [MessageRepository],
})
export class MessageModule {}
