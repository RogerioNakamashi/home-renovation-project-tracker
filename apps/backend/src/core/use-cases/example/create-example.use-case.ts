import { Inject, Injectable } from '@nestjs/common';
import { ExampleEntity } from '../../entities/example.entity';
import type { IExampleRepository } from '../../repositories/example.repository';
import { EXAMPLE_REPOSITORY } from '../../repositories/example.repository';

export interface CreateExampleInput {
  name: string;
  description?: string;
}

@Injectable()
export class CreateExampleUseCase {
  constructor(
    @Inject(EXAMPLE_REPOSITORY)
    private readonly exampleRepository: IExampleRepository,
  ) {}

  async execute(input: CreateExampleInput): Promise<ExampleEntity> {
    const example = ExampleEntity.create(input);
    return this.exampleRepository.create(example);
  }
}
