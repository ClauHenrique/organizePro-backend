import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { UserService } from "./user.service";
import { User, UserSchema } from "./eschema/user.schema";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';


describe('UserService', () => {
  let service: UserService;
  let module: TestingModule;
  let userModel: Model<User>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://mongo:27017/mydb'),
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<User>>(getModelToken('User'));

    // Limpa a coleção antes de cada teste
    await userModel.deleteMany({});
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  it('should create a user', async () => {
    const user = await service.create({
      name: "Paul",
      password: "j7ldd@bbb",
      email: "paul@gmail.com"
    });

    expect(user.name).toBe('Paul');
  });

  it('should hash the password correctly', async () => {

    const password = "j7ldd@bbb"

    const createUserDto = {
      name: "Paul",
      password: password,
      email: "paul@gmail.com"
    }

    await service.create(createUserDto);

    const userDb = await service.findOne(createUserDto.email)
    
    const verify = await bcrypt.compare(password, userDb.password);

    expect(userDb.password).not.toBe(password);
    expect(verify).toBe(true);
  });



  it('should find user by email', async () => {

    const createUser = await service.create({
      name: "Claudio",
      password: "j7ldd@bbb",
      email: "claudio@gmail.com"
    });

    const findUser = await service.findOne(createUser.email);

    expect(findUser.name).toEqual(createUser.name);
    expect(findUser.password).toEqual(createUser.password);
    expect(findUser.email).toEqual(createUser.email);
    expect(findUser._id).toEqual(createUser._id);

  });


});
