import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infra/database/prisma/prisma.module';
import { ExampleModule } from './modules/example/example.module';
import { UserModule } from './modules/user/user.module';
import { JobModule } from './modules/job/job.module';
import { MessageModule } from './modules/message/message.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    PrismaModule,
    ExampleModule,
    UserModule,
    JobModule,
    MessageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
