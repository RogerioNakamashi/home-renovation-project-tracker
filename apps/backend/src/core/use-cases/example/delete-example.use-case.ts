import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IExampleRepository } from '../../repositories/example.repository';
import { EXAMPLE_REPOSITORY } from '../../repositories/example.repository';

@Injectable()
export class DeleteExampleUseCase {
  constructor(
    @Inject(EXAMPLE_REPOSITORY)
    private readonly exampleRepository: IExampleRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const example = await this.exampleRepository.findById(id);

    if (!example) {
      throw new NotFoundException(`Example with id ${id} not found`);
    }

    await this.exampleRepository.delete(id);
  }
}
