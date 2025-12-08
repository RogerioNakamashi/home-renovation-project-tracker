import { randomUUID } from 'crypto';

export interface ExampleProps {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class ExampleEntity {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(
    props: Required<Omit<ExampleProps, 'description'>> &
      Pick<ExampleProps, 'description'>,
  ) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(props: ExampleProps): ExampleEntity {
    return new ExampleEntity({
      id: props.id ?? randomUUID(),
      name: props.name,
      description: props.description,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    });
  }

  update(
    props: Partial<Pick<ExampleProps, 'name' | 'description'>>,
  ): ExampleEntity {
    return new ExampleEntity({
      id: this.id,
      name: props.name ?? this.name,
      description:
        props.description !== undefined ? props.description : this.description,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}
