import { AuthService } from './auth.service';
import { UserService } from './../user/user.service';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginDto, LoginGoogleDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) { }

  @Post('register')
  async register(@Body() RegisterDTO: RegisterDto) {
    const user = await this.userService.registerUser(RegisterDTO);
    const payload = {
      email: user.email,
    };

    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Post('login')
  async login(@Body() UserDTO: LoginDto) {
    const user = await this.userService.findByLogin(UserDTO);
    const payload = {
      email: user.email,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Post('google')
  async loginGoogle(@Body() googleDto: LoginGoogleDto) {
    const user = await this.userService.loginWithGoogle(googleDto);
    const payload = {
      email: user.email,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Get("onlyauth")
  @UseGuards(AuthGuard("jwt"))
  async hiddenInformation() {
    return "hidden information";
  }
}
