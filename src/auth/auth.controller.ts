import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { Public, ResponseMessage, User } from 'src/decorators/customize';
import { Response } from 'express';
import { IUser } from 'src/users/user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @Public()
  @ResponseMessage('Login successfully')
  @UseGuards(LocalAuthGuard)
  handleLogin(@Req() req, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response);
  }

  @Post('/register')
  @ResponseMessage('Register successfully')
  @Public()
  handleRegister(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Get('/account')
  @ResponseMessage('Get account successfully')
  handleGetAccount(@User() user: IUser) {
    return {
      user,
    };
  }

  @Get('/refresh-token')
  @ResponseMessage('Get User By Refresh token successfully')
  @Public()
  handleRefreshToken(
    @Req() req,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = req.cookies['refresh_token'];

    return this.authService.processNewToken(refreshToken, response);
  }

  @Post('/logout')
  @ResponseMessage('Logout successfully')
  handleLogout(
    @Res({ passthrough: true }) response: Response,
    @User() user: IUser,
  ) {
    return this.authService.logout(response, user);
  }
}
