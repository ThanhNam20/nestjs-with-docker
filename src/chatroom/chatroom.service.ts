import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatRoom } from 'src/types/chatroom';
import { Model } from 'mongoose';
import { ChatRoomDto } from './dto/chatroom.dto';
import { UserService } from 'src/user/user.service';
@Injectable()
export class ChatroomService {
  constructor(
    @InjectModel('ChatRoom') private chatRoomModel: Model<ChatRoom>,
    private userService: UserService
  ) { }


  async getChatRoomUser(user_id: string) {
    const chatRoomUserData = await this.chatRoomModel.find({ list_user_id_in_room: user_id });
    if (!chatRoomUserData) {
      return [];
    }
    return chatRoomUserData;
  }

  async createChatRoomWithNewUser(chatRoomDto: ChatRoomDto) {
    const listUserInRoom: any = [];
    const { list_user_id_in_room } = chatRoomDto;
    for await (const item of list_user_id_in_room) {
      const data = await this.userService.findUserById(item);
      if (data) {
        listUserInRoom.push(data);
      }
    }
    chatRoomDto.list_user_in_room = listUserInRoom;
    const createdNewChatRoom = new this.chatRoomModel(chatRoomDto);
    await createdNewChatRoom.save();
    return createdNewChatRoom;
  }
}


