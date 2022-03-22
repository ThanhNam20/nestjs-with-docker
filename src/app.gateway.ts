import { PayLoad } from './types/payload';
import { UserService } from 'src/user/user.service';
import { User } from './types/user';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) {

  }
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  @SubscribeMessage('msgToServer')
  handleMessage(client: Socket, payload: string): void {
    this.server.emit('msgToClient', payload);
  }

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  async handleDisconnect(client: Socket) {
    const user = await this.getDataUserFromToken(client);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    const user = await this.getDataUserFromToken(client);
    this.logger.log(`Client connected: ${client.id}`);
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

