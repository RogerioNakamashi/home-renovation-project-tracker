import { Module } from '@nestjs/common';
import { ExampleResolver } from '../../infra/http/graphql/resolvers/example.resolver';
import { PrismaExampleRepository } from '../../infra/database/prisma/prisma-example.repository';
import { CreateExampleUseCase } from '../../core/use-cases/example/create-example.use-case';
import { FindAllExamplesUseCase } from '../../core/use-cases/example/find-all-examples.use-case';
import { FindExampleByIdUseCase } from '../../core/use-cases/example/find-example-by-id.use-case';
import { UpdateExampleUseCase } from '../../core/use-cases/example/update-example.use-case';
import { DeleteExampleUseCase } from '../../core/use-cases/example/delete-example.use-case';
import { EXAMPLE_REPOSITORY } from '../../core/repositories/example.repository';

@Module({
  providers: [
    ExampleResolver,
    {
      provide: EXAMPLE_REPOSITORY,
      useClass: PrismaExampleRepository,
    },
    {
      provide: CreateExampleUseCase,
      useFactory: (repository) => new CreateExampleUseCase(repository),
      inject: [EXAMPLE_REPOSITORY],
    },
    {
      provide: FindAllExamplesUseCase,
      useFactory: (repository) => new FindAllExamplesUseCase(repository),
      inject: [EXAMPLE_REPOSITORY],
    },
    {
      provide: FindExampleByIdUseCase,
      useFactory: (repository) => new FindExampleByIdUseCase(repository),
      inject: [EXAMPLE_REPOSITORY],
    },
    {
      provide: UpdateExampleUseCase,
      useFactory: (repository) => new UpdateExampleUseCase(repository),
      inject: [EXAMPLE_REPOSITORY],
    },
    {
      provide: DeleteExampleUseCase,
      useFactory: (repository) => new DeleteExampleUseCase(repository),
      inject: [EXAMPLE_REPOSITORY],
    },
  ],
  exports: [EXAMPLE_REPOSITORY],
})
export class ExampleModule {}
