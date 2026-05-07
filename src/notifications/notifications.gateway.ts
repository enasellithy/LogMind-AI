import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' }, 
})
export class NotificationsGateway {
  @WebSocketServer()
  server: Server;

  sendAiNotification(data: any) {
    this.server.emit('new-ai-suggestion', data);
  }
}