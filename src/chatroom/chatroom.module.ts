import { MessageSchema } from './../models/message.schema';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoomSchema } from 'src/models/chatroom.schema';
import { UserModule } from './../user/user.module';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';

@Module({
  imports:[
    MongooseModule.forFeature([{name: 'ChatRoom', schema: ChatRoomSchema}]),
    MongooseModule.forFeature([{name: 'Message', schema: MessageSchema}]),
    UserModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRES_TIME},
    }),
  ],
  providers: [ChatroomService],
  controllers: [ChatroomController],
  exports: [ChatroomService],
})
export class ChatroomModule {}
