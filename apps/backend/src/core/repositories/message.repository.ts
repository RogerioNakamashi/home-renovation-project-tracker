import type { MessageEntity } from '../entities/message.entity';

export interface IMessageRepository {
  create(entity: MessageEntity): Promise<MessageEntity>;
  findByJobId(jobId: string): Promise<MessageEntity[]>;
  findById(id: string): Promise<MessageEntity | null>;
  delete(id: string): Promise<void>;
}

export const MESSAGE_REPOSITORY = Symbol('MESSAGE_REPOSITORY');
