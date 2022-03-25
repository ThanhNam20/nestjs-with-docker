import { Document } from 'mongoose';

export interface Message extends Document {
  message_id: string,
  user_id: string,
  room_id: string,
  content: string
}