import { Inject, Injectable } from '@nestjs/common';
import { MessageEntity } from '../../entities/message.entity';
import type { IMessageRepository } from '../../repositories/message.repository';
import { MESSAGE_REPOSITORY } from '../../repositories/message.repository';

@Injectable()
export class FindMessagesByJobUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
  ) {}

  async execute(jobId: string): Promise<MessageEntity[]> {
    return this.messageRepository.findByJobId(jobId);
  }
}
