import { uuid } from 'uuidv4';
import { MessageDto } from './dto/message.dto';
import { Message } from './../types/message';
import { ChatroomService } from './chatroom.service';
import { PayLoad } from '../types/payload';
import { UserService } from 'src/user/user.service';
import { User } from '../types/user';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
} from '@nestjs/websockets';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway(
  5001, {
  cors: {
    origin: '*',
  },
})
export class ChatroomGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private userData: User;

  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private chatroomService: ChatroomService
  ) {}
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatroomGateway');

  async handleDisconnect(client: Socket) {
    const roomId: any = client.handshake?.query?.roomId;
    client.leave(roomId);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    this.userData = await this.getDataUserFromToken(client);
    const roomId: any = client.handshake?.query?.roomId;
    client.join(roomId);
    this.logger.log(`Client connected: ${client.id}`);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(client: Socket, payload: any): void {   
    const roomId: any = client.handshake?.query?.roomId;
    const newMessageModel : MessageDto = {
      message_id: uuid(),
      room_id: roomId,
      user_id: payload.user_id,
      content: payload.body,
      created_at: Date.now()
    }
    this.chatroomService.createNewMessage(newMessageModel);
    this.server.to(roomId).emit('messageToClient', JSON.stringify(newMessageModel));
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async getDataUserFromToken(client: Socket): Promise<User> {
    const authToken: any = client.handshake?.query?.access_token;    
    try {
      const decoded = this.jwtService.verify(authToken);  
      const userParam : PayLoad = {
        email: decoded.email
      }
      return await this.userService.findUserByGmail(userParam); // response to function
    } catch (ex) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
  }
}

