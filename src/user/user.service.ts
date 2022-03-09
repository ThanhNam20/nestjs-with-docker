import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from 'src/auth/dto/login.dto';
import { User } from 'src/types/user';
import { RegisterDto } from '../auth/dto/register.dto';
import * as bcrypt from 'bcrypt';
import { PayLoad } from 'src/types/payload';
@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
  ) { }

  async registerUser(RegisterDTO: RegisterDto) {
    const { email } = RegisterDTO;
    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }
    const createdUser = new this.userModel(RegisterDTO);
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }
  // return user object without password
  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    return sanitized;
  }

  async findByLogin(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException('user is not exists', HttpStatus.BAD_REQUEST);
    }
    await this.validatePassword(password, user.password);
    return this.sanitizeUser(user);

  }

  private async validatePassword(attemptPass: string, userPassword: string): Promise<any> {
    const match = await bcrypt.compare(attemptPass, userPassword);
    if (!match) {
      throw new NotFoundException('Wrong email or password');
    }
    return match;
  }

  async findByPayload(payload: PayLoad) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

}
