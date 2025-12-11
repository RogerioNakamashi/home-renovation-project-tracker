import { randomUUID } from 'crypto';

export enum SubtaskStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
}

export interface SubtaskProps {
  id?: string;
  jobId: string;
  description: string;
  deadline?: Date | null;
  cost?: number;
  status?: SubtaskStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export class SubtaskEntity {
  readonly id: string;
  readonly jobId: string;
  readonly description: string;
  readonly deadline: Date | null;
  readonly cost: number;
  readonly status: SubtaskStatus;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: Required<SubtaskProps>) {
    this.id = props.id;
    this.jobId = props.jobId;
    this.description = props.description;
    this.deadline = props.deadline;
    this.cost = props.cost;
    this.status = props.status;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: SubtaskProps): SubtaskEntity {
    return new SubtaskEntity({
      id: props.id ?? randomUUID(),
      jobId: props.jobId,
      description: props.description,
      deadline: props.deadline ?? null,
      cost: props.cost ?? 0,
      status: props.status ?? SubtaskStatus.PENDING,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  update(
    props: Partial<
      Pick<SubtaskProps, 'description' | 'deadline' | 'cost' | 'status'>
    >,
  ): SubtaskEntity {
    return new SubtaskEntity({
      id: this.id,
      jobId: this.jobId,
      description: props.description ?? this.description,
      deadline: props.deadline === undefined ? this.deadline : props.deadline,
      cost: props.cost ?? this.cost,
      status: props.status ?? this.status,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  complete(): SubtaskEntity {
    return this.update({ status: SubtaskStatus.COMPLETED });
  }
}
