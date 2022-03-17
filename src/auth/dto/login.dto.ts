export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginGoogleDto {
  email: string;
  uid: string;
  user_avatar: string; 
}