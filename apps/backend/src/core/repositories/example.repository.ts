import { ExampleEntity } from '../entities/example.entity';

export interface IExampleRepository {
  findAll(): Promise<ExampleEntity[]>;
  findById(id: string): Promise<ExampleEntity | null>;
  create(entity: ExampleEntity): Promise<ExampleEntity>;
  update(entity: ExampleEntity): Promise<ExampleEntity>;
  delete(id: string): Promise<void>;
}

export const EXAMPLE_REPOSITORY = Symbol('EXAMPLE_REPOSITORY');
