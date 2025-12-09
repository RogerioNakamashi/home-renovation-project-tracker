import { Injectable } from '@nestjs/common';
import { MessageEntity } from '../../entities/message.entity';
import { MessageRepository } from '../../repositories/message.repository';

@Injectable()
export class FindMessagesByJobUseCase {
  constructor(private readonly messageRepository: MessageRepository) {}

  async execute(jobId: string): Promise<MessageEntity[]> {
    return this.messageRepository.findByJobId(jobId);
  }
}
