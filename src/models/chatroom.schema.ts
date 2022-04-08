import * as mongoose from 'mongoose';


export const ChatRoomSchema = new mongoose.Schema({
  room_id: {
    type: String,
    unique: true,
    required: true
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