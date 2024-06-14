import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/eschema/user.schema';
import { Model } from 'mongoose';
import 'dotenv/config'


describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let module: TestingModule;
  let userModel: Model<User>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://mongo:27017/mydb'),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        JwtModule.register({
          secret: process.env.SECRET_KEY,
          signOptions: { expiresIn: '24h' },
        }),
      ],
      providers: [AuthService, UserService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    userModel = module.get<Model<User>>(getModelToken('User'));
  });

  afterEach(async () => {
    await userModel.deleteMany({});
    await module.close();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  it('should return a JWT token for valid credentials', async () => {
    const createUserDto = {
      name: "Paul",
      password: "j7ldd@bbb",
      email: "paul@gmail.com"
    };

    await userService.create(createUserDto);
    
    const result = await authService.signIn({
      email: 'paul@gmail.com', 
      password: 'j7ldd@bbb'
    });
  
    
    expect(result).toHaveProperty('access_token');
  });

  it('should throw an error for invalid password', async () => {
    const createUserDto = {
      name: "Paul",
      password: "j7ldd@bbb",
      email: "paul@gmail.com"
    };

    await userService.create(createUserDto);
    
    await expect(authService.signIn({
      password: "12345678",
      email: "paul@gmail.com"
    })).rejects.toThrow(UnauthorizedException);
  });

  it('should throw an error for non-existent email', async () => {

    const createUserDto = {
      name: "Paul",
      password: "j7ldd@bbb",
      email: "paul@gmail.com"
    };

    await userService.create(createUserDto);

    await expect(authService.signIn({
       email: 'naoexiste@gmail.com', 
       password: 'paul@gmail.com' 
      })).rejects.toThrow(UnauthorizedException);
  });
});
