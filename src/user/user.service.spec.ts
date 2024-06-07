import { getModelToken } from "@nestjs/mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";
import { User } from "./eschema/user.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";


const mockUser = {
  name: "Paul",
  password: "j7ldd@bbb",
  email: "paul@gmail.com"
};



describe('UserService', () => {
  let service: UserService;
  let userModel: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: {
            save: jest.fn().mockResolvedValue(mockUser),
            findOne: jest.fn().mockResolvedValue(mockUser),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(userModel).toBeDefined();
  });

  it('create user', async () => {
    const createUserDto: CreateUserDto = { 
      name: 'Paul', 
      password: 'j7ldd!bbb', 
      email: 'paul@gmail.com' 
    };

    try {
      const createdUser = await service.create(createUserDto);

      expect(userModel.create).toHaveBeenCalledWith(createUserDto);
      expect(createdUser.name).toEqual('Paul');

    } catch (error) {
      
    }
    
  });

  it('find user by id', async () => {
    const user = await service.findOne('1');
    
    expect(user).toEqual(
      { name: 'Paul', password: 'j7ldd@bbb', email: 'paul@gmail.com' }
    );
  });

 

});
