import { Inject, Injectable } from '@nestjs/common';
import { ExampleEntity } from '../../entities/example.entity';
import type { IExampleRepository } from '../../repositories/example.repository';
import { EXAMPLE_REPOSITORY } from '../../repositories/example.repository';

@Injectable()
export class FindAllExamplesUseCase {
  constructor(
    @Inject(EXAMPLE_REPOSITORY)
    private readonly exampleRepository: IExampleRepository,
  ) {}

  async execute(): Promise<ExampleEntity[]> {
    return this.exampleRepository.findAll();
  }
}
