import { Injectable } from '@nestjs/common';
import { MessageRepository } from '../../../core/repositories/message.repository';
import { MessageEntity } from '../../../core/entities/message.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PrismaMessageRepository extends MessageRepository {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async create(entity: MessageEntity): Promise<MessageEntity> {
    const created = await this.prisma.message.create({
      data: {
        id: entity.id,
        content: entity.content,
        jobId: entity.jobId,
        senderId: entity.senderId,
        createdAt: entity.createdAt,
      },
    });

    return this.toDomain(created);
  }

  async findByJobId(jobId: string): Promise<MessageEntity[]> {
    const messages = await this.prisma.message.findMany({
      where: { jobId },
      orderBy: { createdAt: 'asc' },
    });

    return messages.map((message) => this.toDomain(message));
  }

  async findById(id: string): Promise<MessageEntity | null> {
    const message = await this.prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return null;
    }

    return this.toDomain(message);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.message.delete({
      where: { id },
    });
  }

  private toDomain(raw: {
    id: string;
    content: string;
    jobId: string;
    senderId: string;
    createdAt: Date;
  }): MessageEntity {
    return MessageEntity.create({
      id: raw.id,
      content: raw.content,
      jobId: raw.jobId,
      senderId: raw.senderId,
      createdAt: raw.createdAt,
    });
  }
}
