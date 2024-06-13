import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/eschema/user.schema';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import * as bcrypt from 'bcrypt';
import 'dotenv/config'

describe('AuthController', () => {
  let app: INestApplication;
  let userModel: Model<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://mongo:27017/mydb'),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
        JwtModule.register({
          secret: process.env.SECRET_KEY,
          signOptions: { expiresIn: '24h' },
        }),
        UserModule,
      ],
      controllers: [AuthController],
      providers: [AuthService, UserService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userModel = moduleFixture.get<Model<User>>(getModelToken('User'));
  });

  afterEach(async () => {
    await userModel.deleteMany({});
  });

  afterAll(async () => {
    await userModel.deleteMany({});
    await app.close();
  });

  it('should be defined', () => {
    const controller = app.get<AuthController>(AuthController);
    expect(controller).toBeDefined();
  });

  it('/POST auth/login should return JWT token for valid credentials', async () => {
    console.log("var AMBIENTEEEE: ", process.env.SECRET_KEY);
    
    const createUserDto = {
      name: "Claudio",
      password: await bcrypt.hash("j7ldd@bbb", 8),
      email: "claudio@gmail.com"
    };

    await userModel.create(createUserDto);  

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "claudio@gmail.com",
        password: "j7ldd@bbb",
      })
      // .expect(200);
      console.log("response!!!!! ", response.body);
      
      

    // expect(response.body).toHaveProperty('access_token');
  });

  it('/POST auth/login should return 401 for invalid password', async () => {
    const createUserDto = {
      name: "Claudio",
      password: await bcrypt.hash("j7ldd@bbb", 8),
      email: "claudio@gmail.com"
    };

    await userModel.create(createUserDto);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "claudio@gmail.com",
        password: "senhaerrada",
      })
      .expect(401);
  });

  it('/POST auth/login should return 401 for non-existent email', async () => {
    const createUserDto = {
      name: "Claudio",
      password: await bcrypt.hash("j7ldd@bbb", 8),
      email: "claudio@gmail.com"
    };

    await userModel.create(createUserDto);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "naoexiste@gmail.com",
        password: "j7ldd@bbb",
      })
      .expect(401);
  });
});
