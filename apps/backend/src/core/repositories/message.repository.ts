import type { MessageEntity } from '../entities/message.entity';

export abstract class MessageRepository {
  abstract create(entity: MessageEntity): Promise<MessageEntity>;
  abstract findByJobId(jobId: string): Promise<MessageEntity[]>;
  abstract findById(id: string): Promise<MessageEntity | null>;
  abstract delete(id: string): Promise<void>;
}
