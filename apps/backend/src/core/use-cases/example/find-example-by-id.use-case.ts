import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ExampleEntity } from '../../entities/example.entity';
import type { IExampleRepository } from '../../repositories/example.repository';
import { EXAMPLE_REPOSITORY } from '../../repositories/example.repository';

@Injectable()
export class FindExampleByIdUseCase {
  constructor(
    @Inject(EXAMPLE_REPOSITORY)
    private readonly exampleRepository: IExampleRepository,
  ) {}

  async execute(id: string): Promise<ExampleEntity | null> {
    return this.exampleRepository.findById(id);
  }
}
