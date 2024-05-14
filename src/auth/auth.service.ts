import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from 'src/users/dto/register-user.dto';
import { IUser } from 'src/users/user.interface';
import { UsersService } from 'src/users/users.service';
import ms from 'ms';
import { Response } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  //username va password la 2 tham so thu vien passport tra ve
  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const isValid = this.usersService.isValidPassowrd(pass, user.password);

      if (isValid === true) {
        return user;
      }
    }

    return null;
  }

  createRefreshToken = (payload: any) => {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn:
        ms(this.configService.get<string>('JWT_REFRESH_EXPRIE')) / 1000,
    });

    return refreshToken;
  };

  login = async (user: IUser, response: Response) => {
    const { _id, email, name, role } = user;

    const payload = {
      sub: 'token login',
      iss: 'from service',
      _id,
      email,
      name,
      role,
    };

    const refreshToken = this.createRefreshToken(payload);

    //update refresh token in database
    await this.usersService.updateRefreshToken(_id, refreshToken);

    //set cookie
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPRIE')),
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        email,
        name,
        role,
      },
    };
  };

  register = async (data: RegisterUserDto) => {
    const newUser = await this.usersService.register(data);

    return newUser;
  };

  processNewToken = async (refresh_token: string, response: Response) => {
    try {
      this.jwtService.verify(refresh_token, {
        secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
      });

      let user = await this.usersService.findUserByRefreshToken(refresh_token);

      if (user) {
        const { _id, name, role, email } = user;

        const payload = {
          sub: 'token refresh',
          iss: 'from server',
          _id,
          name,
          email,
          role,
        };

        const refreshToken = this.createRefreshToken(payload);

        await this.usersService.updateRefreshToken(
          _id.toString(),
          refreshToken,
        );

        //clear cookie old
        response.clearCookie('refresh_token');

        //update cookie new
        response.cookie('refresh_token', refreshToken, {
          httpOnly: true,
          maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPRIE')),
        });

        return {
          access_token: this.jwtService.sign(payload),
          user: {
            _id,
            email,
            name,
            role,
          },
        };
      } else {
        throw new BadRequestException(
          'Refresh token is invalid. Please login again!',
        );
      }
    } catch (error) {
      throw new BadRequestException(
        'Refresh token is invalid. Please login again!',
      );
    }
  };

  logout = async (response: Response, user: IUser) => {
    await this.usersService.updateRefreshToken(user._id, '');

    response.clearCookie('refresh_token');

    return 'ok';
  };
}
