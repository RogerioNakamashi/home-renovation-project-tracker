import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { MessageEntity } from '../../entities/message.entity';
import { MessageRepository } from '../../repositories/message.repository';
import { JobRepository } from '../../repositories/job.repository';

export interface SendMessageInput {
  content: string;
  jobId: string;
  senderId: string;
}

@Injectable()
export class SendMessageUseCase {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly jobRepository: JobRepository,
  ) {}

  async execute(input: SendMessageInput): Promise<MessageEntity> {
    const job = await this.jobRepository.findById(input.jobId);

    if (!job) {
      throw new NotFoundException(`Job with id ${input.jobId} not found`);
    }

    // Only contractor or homeowner of this job can send messages
    if (
      job.contractorId !== input.senderId &&
      job.homeownerId !== input.senderId
    ) {
      throw new ForbiddenException(
        'Only the contractor or homeowner of this job can send messages',
      );
    }

    const message = MessageEntity.create({
      content: input.content,
      jobId: input.jobId,
      senderId: input.senderId,
    });

    return this.messageRepository.create(message);
  }
}
