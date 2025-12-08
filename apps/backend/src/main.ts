import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for GraphQL
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
  });
  
  await app.listen(process.env.PORT ?? 4000);
  console.log(`🚀 Server is running on: http://localhost:${process.env.PORT ?? 4000}`);
  console.log(`📊 GraphQL Playground: http://localhost:${process.env.PORT ?? 4000}/graphql`);
}
bootstrap();
