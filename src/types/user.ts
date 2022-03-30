import { Document } from 'mongoose';

export interface User extends Document {
   user_id: string;
   email: string;
   password: string;
   user_avatar: string;
}