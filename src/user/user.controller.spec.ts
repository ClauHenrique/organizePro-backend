import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User, UserSchema } from './eschema/user.schema';

describe('UserController', () => {
  let app: INestApplication;
  let userModel: Model<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://mongo:27017/mydb'),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
      ],
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userModel = moduleFixture.get<Model<User>>(getModelToken('User'));
  });

  afterAll(async () => {
    await userModel.deleteMany({}); // Limpa banco
    await app.close();
  });

  it('should be defined', () => {
    const controller = app.get<UserController>(UserController);
    expect(controller).toBeDefined();
  });

  it('/POST create user', async () => {
    const createUserDto = {
      name: "Paul",
      password: "j7ldd@bbb",
      email: "paul@gmail.com"
    };

    const response = await request(app.getHttpServer())
      .post('/user')
      .send(createUserDto)
      .expect(201);

    expect(response.body.name).toBe('Paul');
    expect(response.body.email).toBe('paul@gmail.com');
  });

});
