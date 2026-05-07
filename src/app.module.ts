import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
@Module({
  imports: [
    ElasticsearchModule.register({
      node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9500',
    }),
    ClientsModule.register([
      {
        name: 'LOG_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: { brokers: [process.env.KAFKA_BROKER || 'localhost:9092'] },
          producerOnlyMode: true, 
        },
      },
      {
        name: 'RECOVERY_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'recovery_tasks',
          queueOptions: {
            durable: true 
          },
        },
      },
    ]),
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationsGateway],
})
export class AppModule {}