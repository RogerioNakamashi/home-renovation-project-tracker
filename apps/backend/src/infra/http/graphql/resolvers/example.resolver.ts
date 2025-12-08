import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ExampleType } from '../types/example.type';
import { CreateExampleInput, UpdateExampleInput } from '../dto';
import { CreateExampleUseCase } from '../../../../core/use-cases/example/create-example.use-case';
import { FindAllExamplesUseCase } from '../../../../core/use-cases/example/find-all-examples.use-case';
import { FindExampleByIdUseCase } from '../../../../core/use-cases/example/find-example-by-id.use-case';
import { UpdateExampleUseCase } from '../../../../core/use-cases/example/update-example.use-case';
import { DeleteExampleUseCase } from '../../../../core/use-cases/example/delete-example.use-case';

@Resolver(() => ExampleType)
export class ExampleResolver {
  constructor(
    private readonly createExampleUseCase: CreateExampleUseCase,
    private readonly findAllExamplesUseCase: FindAllExamplesUseCase,
    private readonly findExampleByIdUseCase: FindExampleByIdUseCase,
    private readonly updateExampleUseCase: UpdateExampleUseCase,
    private readonly deleteExampleUseCase: DeleteExampleUseCase,
  ) {}

  @Query(() => [ExampleType], { name: 'examples' })
  async findAll(): Promise<ExampleType[]> {
    const examples = await this.findAllExamplesUseCase.execute();
    return examples.map((example) => this.toGraphQL(example));
  }

  @Query(() => ExampleType, { name: 'example', nullable: true })
  async findOne(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<ExampleType | null> {
    const example = await this.findExampleByIdUseCase.execute(id);
    return example ? this.toGraphQL(example) : null;
  }

  @Mutation(() => ExampleType)
  async createExample(
    @Args('input') input: CreateExampleInput,
  ): Promise<ExampleType> {
    const example = await this.createExampleUseCase.execute(input);
    return this.toGraphQL(example);
  }

  @Mutation(() => ExampleType)
  async updateExample(
    @Args('input') input: UpdateExampleInput,
  ): Promise<ExampleType> {
    const example = await this.updateExampleUseCase.execute(input.id, {
      name: input.name,
      description: input.description,
    });
    return this.toGraphQL(example);
  }

  @Mutation(() => Boolean)
  async deleteExample(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    await this.deleteExampleUseCase.execute(id);
    return true;
  }

  private toGraphQL(entity: {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
  }): ExampleType {
    return {
      id: entity.id,
      name: entity.name,
      description: entity.description,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
