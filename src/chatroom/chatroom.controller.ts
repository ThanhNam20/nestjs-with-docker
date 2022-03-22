import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ChatroomService } from './chatroom.service';
import { ChatRoomDto } from './dto/chatroom.dto';

@Controller('chatroom')
export class ChatroomController {
  constructor(
    private chatroomService: ChatroomService,
  ) { }

  @Get("get-chatroom?")
  @UseGuards(AuthGuard("jwt"))
  async getChatRoomUser(@Query('user_id') user_id: string) {
    return await this.chatroomService.getChatRoomUser(user_id);
  }

  @Post("create-chatroom")
  @UseGuards(AuthGuard("jwt"))
  async createChatRoom(@Body() chatRoomDto: ChatRoomDto) {
    return await this.chatroomService.createChatRoomWithNewUser(chatRoomDto);
  }

}
