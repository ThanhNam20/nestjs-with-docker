export interface MessageDto {
  message_id: string,
  user_id: string,
  room_id: string,
  content: string,
  created_at: number,
  message_type?: number
}