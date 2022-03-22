import { LoginGoogleDto } from './../auth/dto/login.dto';
import { AUTHEN_MESSAGE } from './../config/constant';
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from 'src/auth/dto/login.dto';
import { User } from 'src/types/user';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { PayLoad } from 'src/types/payload';
import { USER_AVATAR } from 'src/config/constant';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
  ) { }

  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async registerUser(RegisterDTO: RegisterDto) {
    const { email } = RegisterDTO;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException(AUTHEN_MESSAGE.USER_EXIST, HttpStatus.BAD_REQUEST);
    }
    RegisterDTO.user_avatar = USER_AVATAR;
    const createdUser = new this.userModel(RegisterDTO);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }
  // return user object without password

  async findByLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException(AUTHEN_MESSAGE.USER_NOT_EXIST, HttpStatus.BAD_REQUEST);
    }
    await this.validatePassword(password, user.password);
    return this.sanitizeUser(user);
  }

  async loginWithGoogle(loginWithGoogle: LoginGoogleDto) {
    const { uid } = loginWithGoogle;
    const user = await this.userModel.findOne({ uid });
    if (user) {
      return user;
    } else {
      const createdUser = new this.userModel(loginWithGoogle);
      await createdUser.save();
      return this.sanitizeUser(createdUser);
    }

  }

  async validatePassword(attemptPass: string, userPassword: string){
    const match = await bcrypt.compare(attemptPass, userPassword);
    if (!match) {
      throw new NotFoundException(AUTHEN_MESSAGE.WRONG_EMAIL_OR_PASSWORD);
    }
    return match;
  }

  async findUserByGmail(payload: PayLoad) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  async findUserById(user_id: string) {
    return await this.userModel.findOne({ user_id });
  }

  async findAllUser() {
    return await this.userModel.find();
  }

}
