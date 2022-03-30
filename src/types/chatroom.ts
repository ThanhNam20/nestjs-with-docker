import { Document } from 'mongoose';

export interface ChatRoom extends Document {
  room_id: string,
  list_user_in_room: [],
  list_user_room: [],
  last_message_id: string
}