import { uuid } from 'uuidv4';
import * as mongoose from 'mongoose';


export const ChatRoomSchema = new mongoose.Schema({
  room_id: {
    type: String,
    default: uuid(),
    required: true,
    unique: true
  },
  list_user_id_in_room: {
    type: [],
    required: false
  },
  list_user_in_room: {
    type: [],
    required: false
  },
  last_message_id: {
    type: String,
    required: false
  }
})