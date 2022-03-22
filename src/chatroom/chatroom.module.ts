import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatRoomSchema } from 'src/models/chatroom.schema';
import { UserModule } from './../user/user.module';
import { ChatroomController } from './chatroom.controller';
import { ChatroomService } from './chatroom.service';

@Module({
  imports:[
    MongooseModule.forFeature([{name: 'ChatRoom', schema: ChatRoomSchema}]),
    UserModule
  ],
  providers: [ChatroomService],
  controllers: [ChatroomController],
  exports: [ChatroomService],
})
export class ChatroomModule {}
