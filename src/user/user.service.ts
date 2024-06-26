import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './eschema/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UserService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      
      // criptografar a senha
      const hash = await bcrypt.hash(createUserDto.password, 8);
      createUserDto.password = hash

      const createdUser = new this.userModel(createUserDto);

      return await createdUser.save();
    }
    catch(err) {
        throw new Error(`Unable to register user. ${err}`)
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(email: string): Promise<User> {
    try {
      return await this.userModel.findOne({email})

    } catch (err) {
      throw new Error(`Unable to perform user search operation. ${err}`)
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
