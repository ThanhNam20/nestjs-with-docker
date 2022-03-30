import {
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway(
  5002, {
  cors: {
    origin: '*',
  },
})
export class AppGateway  {
  @WebSocketServer() server: Server;

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: any): void {   
    this.server.emit('messageToClient', JSON.stringify(payload));
  }
}

