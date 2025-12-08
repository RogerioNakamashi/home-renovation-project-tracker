import { randomUUID } from 'crypto';

export enum JobStatus {
  PLANNING = 'PLANNING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface JobProps {
  id?: string;
  description: string;
  address: string;
  status?: JobStatus;
  cost?: number;
  contractorId: string;
  homeownerId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class JobEntity {
  readonly id: string;
  readonly description: string;
  readonly address: string;
  readonly status: JobStatus;
  readonly cost: number;
  readonly contractorId: string;
  readonly homeownerId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: Required<JobProps>) {
    this.id = props.id;
    this.description = props.description;
    this.address = props.address;
    this.status = props.status;
    this.cost = props.cost;
    this.contractorId = props.contractorId;
    this.homeownerId = props.homeownerId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: JobProps): JobEntity {
    return new JobEntity({
      id: props.id ?? randomUUID(),
      description: props.description,
      address: props.address,
      status: props.status ?? JobStatus.PLANNING,
      cost: props.cost ?? 0,
      contractorId: props.contractorId,
      homeownerId: props.homeownerId,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  update(
    props: Partial<
      Pick<JobProps, 'description' | 'address' | 'status' | 'cost'>
    >,
  ): JobEntity {
    return new JobEntity({
      id: this.id,
      description: props.description ?? this.description,
      address: props.address ?? this.address,
      status: props.status ?? this.status,
      cost: props.cost ?? this.cost,
      contractorId: this.contractorId,
      homeownerId: this.homeownerId,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }

  updateCost(cost: number): JobEntity {
    return this.update({ cost });
  }

  start(): JobEntity {
    return this.update({ status: JobStatus.IN_PROGRESS });
  }

  complete(): JobEntity {
    return this.update({ status: JobStatus.COMPLETED });
  }

  cancel(): JobEntity {
    return this.update({ status: JobStatus.CANCELED });
  }

  isPlanning(): boolean {
    return this.status === JobStatus.PLANNING;
  }

  isInProgress(): boolean {
    return this.status === JobStatus.IN_PROGRESS;
  }

  isCompleted(): boolean {
    return this.status === JobStatus.COMPLETED;
  }

  isCanceled(): boolean {
    return this.status === JobStatus.CANCELED;
  }
}
