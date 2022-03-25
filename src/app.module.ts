import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AppGateway } from './app.gateway';
import { JwtModule } from '@nestjs/jwt';
import { ChatroomModule } from './chatroom/chatroom.module';
import { ChatroomGateway } from './chatroom/chatroom.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    UserModule,
    ChatroomModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
      signOptions: { expiresIn: process.env.EXPIRES_TIME},
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, ChatroomGateway],
})
export class AppModule {}
