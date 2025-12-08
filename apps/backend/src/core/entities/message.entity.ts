import { randomUUID } from 'crypto';

export interface MessageProps {
  id?: string;
  content: string;
  jobId: string;
  senderId: string;
  createdAt?: Date;
}

export class MessageEntity {
  readonly id: string;
  readonly content: string;
  readonly jobId: string;
  readonly senderId: string;
  readonly createdAt: Date;

  private constructor(props: Required<MessageProps>) {
    this.id = props.id;
    this.content = props.content;
    this.jobId = props.jobId;
    this.senderId = props.senderId;
    this.createdAt = props.createdAt;
  }

  static create(props: MessageProps): MessageEntity {
    return new MessageEntity({
      id: props.id ?? randomUUID(),
      content: props.content,
      jobId: props.jobId,
      senderId: props.senderId,
      createdAt: props.createdAt ?? new Date(),
    });
  }
}
