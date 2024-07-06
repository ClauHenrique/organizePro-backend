import { ConflictException, Injectable } from '@nestjs/common';
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
    // verificar se ja existe um cadastro com esse email
    const {email} = createUserDto
    const verify = await this.userModel.findOne({email})

    if (verify) {
      throw new ConflictException("Este usuario já existe")
    }
    
    try {
       // criptografar a senha
      const hash = await bcrypt.hash(createUserDto.password, 8);
      createUserDto.password = hash

      const createdUser = new this.userModel(createUserDto);

      return await createdUser.save();
      
    } catch (error) {
      throw new ConflictException("Este usuario já existe")
    }
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(email: string): Promise<User> {
      return await this.userModel.findOne({email})
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
