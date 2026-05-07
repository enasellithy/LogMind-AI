import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      },
      consumer: {
        groupId: 'log-analyzer-group-v2', 
        allowAutoTopicCreation: true,
      }
    }
  });

  app.enableCors();

  await app.startAllMicroservices();
  await app.listen(process.env.PORT ?? 3000);
  console.log('🚀 AI Log Analyzer is running on: http://localhost:3000');
}
bootstrap();