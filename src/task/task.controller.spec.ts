import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Task, TaskSchema } from './schema/task.schema';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { AuthModule } from '../auth/auth.module';
import { User, UserSchema } from '../user/eschema/user.schema';
import { UserService } from '../user/user.service';
import { JwtModule } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TaskController', () => {
  let app: INestApplication;
  let taskModel: Model<Task>;
  let userModel: Model<User>;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://mongo:27017/mydb'),
        MongooseModule.forFeature([
          { name: 'Task', schema: TaskSchema }, 
          { name: 'User', schema: UserSchema }
        ]),
        // JwtModule.register({
        //   secret: 'dhh7824dwedhqhk378d23',
        //   signOptions: { expiresIn: '24h' },
        // }),
        AuthModule,
      ],
      controllers: [TaskController],
      providers: [TaskService, UserService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    taskModel = moduleFixture.get<Model<Task>>(getModelToken('Task'));
    userModel = moduleFixture.get<Model<User>>(getModelToken('User'));
  });

  afterAll(async () => {
    await taskModel.deleteMany({});
    await userModel.deleteMany({}); 
    await app.close();
  });

  afterEach(async () => {
    await taskModel.deleteMany({});
    await userModel.deleteMany({});
  });

  it('should be defined', () => {
    const controller = app.get<TaskController>(TaskController);
    expect(controller).toBeDefined();
  });

  it('/POST do not allow registering a task if the user is not logged in', async () => {
      
      const createTaskDto: CreateTaskDto = {
        userId: '',
        title: "task 1",
        description: "this is a task 1",
        startDate: new Date("2024-05-13T11:30:00.000Z"),
        endDate: new Date("2024-05-13T13:00:00.000Z"),
        priority: 4
      }

    const response = await request(app.getHttpServer())
      .post('/task')
      .set('Authorization', `Bearer `)
      .send(createTaskDto)
      .expect(401);
      
    expect(response.body.message).toBe('Unauthorized');
  });

  it('/POST create task', async () => {
    const createUserDto = {
      name: "Claudio",
      password: await bcrypt.hash("j7ldd@bbb", 8),
      email: "claudio@gmail.com"
    };

    await userModel.create(createUserDto);  

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "claudio@gmail.com",
        password: "j7ldd@bbb",
      })
      
      
      const createTaskDto: CreateTaskDto = {
        userId: '',
        title: "task 1",
        description: "this is a task 1",
        startDate: new Date("2024-05-13T11:30:00.000Z"),
        endDate: new Date("2024-05-13T13:00:00.000Z"),
        priority: 4
      }

    const response = await request(app.getHttpServer())
      .post('/task')
      .set('Authorization', `Bearer ${body.access_token}`)
      .send(createTaskDto)
      .expect(201);

    expect(response.body.title).toBe('task 1');
    expect(response.body.description).toBe('this is a task 1');
  });

  it('/POST should not allow the registration of tasks with conflicting times', async () => {
    const createUserDto = {
      name: "Claudio",
      password: await bcrypt.hash("j7ldd@bbb", 8),
      email: "claudio@gmail.com"
    };

    await userModel.create(createUserDto);  

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "claudio@gmail.com",
        password: "j7ldd@bbb",
      })
      
      
      const createTaskDto1: CreateTaskDto = {
        userId: '',
        title: "task 1",
        description: "this is a task 1",
        startDate: new Date("2024-05-13T11:30:00.000Z"),
        endDate: new Date("2024-05-13T13:00:00.000Z"),
        priority: 4
      }

    const response = await request(app.getHttpServer())
      .post('/task')
      .set('Authorization', `Bearer ${body.access_token}`)
      .send(createTaskDto1)
      .expect(201);

       
      const createTaskDto2: CreateTaskDto = {
        userId: '',
        title: "task 2",
        description: "this is a task 2",
        startDate: new Date("2024-05-13T11:30:00.000Z"),
        endDate: new Date("2024-05-13T13:00:00.000Z"),
        priority: 4
      }

      const response2 = await request(app.getHttpServer())
      .post('/task')
      .set('Authorization', `Bearer ${body.access_token}`)
      .send(createTaskDto2)
      .expect(409);

    expect(response2.body.message).toBe('A task is already scheduled at this time.');
  });

  it('/POST tasks from different users can contain the same time', async () => {

    const createUserDto1 = {
      name: "Claudio",
      password: await bcrypt.hash("j7ldd@bbb", 8),
      email: "claudio@gmail.com"
    };

    await userModel.create(createUserDto1);

    const createUserDto2 = {
      name: "John",
      password: await bcrypt.hash("j7ldd@bbb", 8),
      email: "john@gmail.com"
    };

    await userModel.create(createUserDto2);  

    const user1 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "claudio@gmail.com",
        password: "j7ldd@bbb",
      })
      
      
      const createTaskDto1: CreateTaskDto = {
        userId: '',
        title: "task 1",
        description: "this is a task 1 of user 1",
        startDate: new Date("2024-05-13T11:30:00.000Z"),
        endDate: new Date("2024-05-13T13:00:00.000Z"),
        priority: 4
      }
    
    console.log(">>>>>", user1.body.access_token);

    const c = await request(app.getHttpServer())
      .post('/task')
      .set('Authorization', `Bearer ${user1.body.access_token}`)
      .send(createTaskDto1)
      // .expect(201);

      console.log("tarefa criada >>>", c.body);
      

      const user2 = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "john@gmail.com",
        password: "j7ldd@bbb",
      })
      
      
      const createTaskDto2: CreateTaskDto = {
        userId: '',
        title: "task 1",
        description: "this is a task 1 of user 2",
        startDate: new Date("2024-05-13T11:30:00.000Z"),
        endDate: new Date("2024-05-13T13:00:00.000Z"),
        priority: 4
      }

    const response = await request(app.getHttpServer())
      .post('/task')
      .set('Authorization', `Bearer ${user2.body.access_token}`)
      .send(createTaskDto2)
      .expect(201);

      expect(response.body.description).toBe('this is a task 1 of user 2')
      
  })

  it('/PATCH update task', async () => {
    const createUserDto = {
      name: "Claudio",
      password: await bcrypt.hash("j7ldd@bbb", 8),
      email: "claudio@gmail.com"
    };

    await userModel.create(createUserDto);  

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "claudio@gmail.com",
        password: "j7ldd@bbb",
      })
      
      
      const createTaskDto: CreateTaskDto = {
        userId: '',
        title: "task 1",
        description: "this is a task 1",
        startDate: new Date("2024-05-13T11:30:00.000Z"),
        endDate: new Date("2024-05-13T13:00:00.000Z"),
        priority: 4
      }

    const res = await request(app.getHttpServer())
      .post('/task')
      .set('Authorization', `Bearer ${body.access_token}`)
      .send(createTaskDto)
      
      const updateTaskDto: UpdateTaskDto = {
        description: "this is a task 1000000",
      }

      const taskId = res.body._id.toString()

      const update = await request(app.getHttpServer())
      .patch(`/task/${taskId}`)
      .set('Authorization', `Bearer ${body.access_token}`)
      .send(updateTaskDto)
      .expect(200)

      expect(update.body.description).toBe("this is a task 1000000");
      
  });

  it('/DELETE remove task', async () => {
    const createUserDto = {
      name: "Claudio",
      password: await bcrypt.hash("j7ldd@bbb", 8),
      email: "claudio@gmail.com"
    };

    await userModel.create(createUserDto);  

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: "claudio@gmail.com",
        password: "j7ldd@bbb",
      })
      
      
      const createTaskDto: CreateTaskDto = {
        userId: '',
        title: "task 1",
        description: "this is a task 1",
        startDate: new Date("2024-05-13T11:30:00.000Z"),
        endDate: new Date("2024-05-13T13:00:00.000Z"),
        priority: 4
      }

    const res = await request(app.getHttpServer())
      .post('/task')
      .set('Authorization', `Bearer ${body.access_token}`)
      .send(createTaskDto)
      
      const taskId = res.body._id.toString()

      await request(app.getHttpServer())
      .delete(`/task/${taskId}`)
      .set('Authorization', `Bearer ${body.access_token}`)
      .expect(200)
      
  });

 
});