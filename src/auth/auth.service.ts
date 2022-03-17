import { PayLoad } from './../types/payload';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
  ){}

  async signPayload(payload: PayLoad) {
    return sign(payload, process.env.SECRET_KEY, { expiresIn: '1d' });
  }

  async validateUser(payload: PayLoad) {
    return await this.userService.findByPayload(payload);
  }

}
