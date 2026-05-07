import { Controller, Post, Body, Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka, ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';
import { AiService } from './ai/ai.service';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Controller('ingest')
export class AppController implements OnModuleInit {
  constructor(
    private readonly aiService: AiService,
    private readonly elasticsearchService: ElasticsearchService,
    private readonly notificationsGateway: NotificationsGateway,
    @Inject('LOG_SERVICE') private readonly kafkaClient: ClientKafka,
    @Inject('RECOVERY_SERVICE') private readonly rabbitClient: ClientProxy, // 👈 إضافة رابيت إم كيو
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }
  @Post()
  async ingestLog(@Body() logData: { service: string; level: string; message: string }) {
    console.log('📤 New log received, pushing to Kafka...');
    return this.kafkaClient.emit('system-logs', logData);
  }

  @MessagePattern('system-logs')
  async handleLogAnalysis(@Payload() data: any) {
    const log = typeof data === 'string' ? JSON.parse(data) : data;

    if (log.level === 'ERROR') {
      console.log(`🔍 Analyzing Error from service: ${log.service}`);

      const suggestion = await this.aiService.analyzeError(log.message);

      this.notificationsGateway.sendAiNotification({ ...log, suggestion });

      try {
        await this.elasticsearchService.index({
          index: 'system-analysis-logs',
          document: {
            service: log.service,
            level: log.level,
            error_message: log.message,
            ai_suggestion: suggestion,
            timestamp: new Date(),
          },
        });
        console.log('📂 Log & AI Suggestion indexed in Elasticsearch');
      } catch (err) {
        console.error('❌ Elasticsearch Indexing Error:', err.message);
      }

      const lowerSuggestion = suggestion.toLowerCase();
      if (lowerSuggestion.includes('restart') || lowerSuggestion.includes('fix') || lowerSuggestion.includes('clear')) {
        this.rabbitClient.emit('recovery-commands', {
          action: 'EXECUTE_RECOVERY',
          service: log.service,
          instruction: suggestion,
          timestamp: new Date(),
        });
        console.log('🚀 Recovery Command dispatched to RabbitMQ!');
      }
    }
  }
  @MessagePattern('recovery-commands')
  async executeRecovery(@Payload() data: any) {
    console.log('\n--- 🛠️  RECOVERY WORKER NODE STARTED ---');
    console.log(`Target Service: ${data.service}`);
    console.log(`Action: ${data.action}`);
    console.log(`AI Instruction: ${data.instruction}`);
    
    console.log('⏳ Processing recovery logic...');
    setTimeout(() => {
        console.log('✅ Recovery Task Completed Successfully!');
        console.log('---------------------------------------\n');
    }, 2000);
  }
}