import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { MessageEntity } from '../../entities/message.entity';
import type { IMessageRepository } from '../../repositories/message.repository';
import { MESSAGE_REPOSITORY } from '../../repositories/message.repository';
import type { IJobRepository } from '../../repositories/job.repository';
import { JOB_REPOSITORY } from '../../repositories/job.repository';

export interface SendMessageInput {
  content: string;
  jobId: string;
  senderId: string;
}

@Injectable()
export class SendMessageUseCase {
  constructor(
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    @Inject(JOB_REPOSITORY)
    private readonly jobRepository: IJobRepository,
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
