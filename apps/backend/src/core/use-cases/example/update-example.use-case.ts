import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExampleEntity } from '../../entities/example.entity';
import type { IExampleRepository } from '../../repositories/example.repository';
import { EXAMPLE_REPOSITORY } from '../../repositories/example.repository';

export interface UpdateExampleInput {
  name?: string;
  description?: string;
}

@Injectable()
export class UpdateExampleUseCase {
  constructor(
    @Inject(EXAMPLE_REPOSITORY)
    private readonly exampleRepository: IExampleRepository,
  ) {}

  async execute(id: string, input: UpdateExampleInput): Promise<ExampleEntity> {
    const example = await this.exampleRepository.findById(id);

    if (!example) {
      throw new NotFoundException(`Example with id ${id} not found`);
    }

    const updatedExample = example.update(input);

    return this.exampleRepository.update(updatedExample);
  }
}
