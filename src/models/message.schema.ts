import * as mongoose from 'mongoose';

export const MessageSchema = new mongoose.Schema({
  message_id: {
    type: String,
    unique: true,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  room_id: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  created_at: {
    type: Number,
    required: true
  }
})