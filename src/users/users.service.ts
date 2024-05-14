import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { SoftDeleteModel } from 'mongoose-delete';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
  ) {}

  hashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  isValidPassowrd = (password: string, hash: string) => {
    return compareSync(password, hash);
  };

  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  async register(data: RegisterUserDto) {
    const { email, password, name } = data;

    const checkEmail = await this.userModel.findOne({ email }).exec();

    if (checkEmail) {
      throw new BadRequestException('Email is already existed');
    }

    const hassPass = this.hashPassword(password);

    const register = await this.userModel.create({
      email,
      password: hassPass,
      name,
    });

    return register;
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findOneByUsername(username: string) {
    return await this.userModel.findOne({
      email: username,
    });
  }

  findUserByRefreshToken = async (refreshToken: string) => {
    return await this.userModel.findOne({ refreshToken }).exec();
  };

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  updateRefreshToken = async (id: string, refreshToken: string) => {
    return await this.userModel.updateOne({ _id: id }, { refreshToken }).exec();
  };

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
