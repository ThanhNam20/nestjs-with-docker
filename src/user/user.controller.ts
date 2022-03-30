import { UserService } from './user.service';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService
  ){}

  @Get("get-all-user")
  @UseGuards(AuthGuard("jwt"))
  async getAllUser() {
    return await this.userService.findAllUser();
  }

}
