import { MongooseModule, getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import * as bcrypt from 'bcrypt';
import { TaskService } from "./task.service";
import { Task, TaskSchema } from "./schema/task.schema";
import { CreateTaskDto } from "./dto/create-task.dto";
import { TaskSchedulingConflictException } from "./exceptions/task-scheduling-conflict.exception";
import { UpdateTaskDto } from "./dto/update-task.dto";


describe('TaskService', () => {
  let service: TaskService;
  let module: TestingModule;
  let taskModel: Model<Task>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://mongo:27017/mydb'),
        MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]),
      ],
      providers: [TaskService],
    }).compile();

    service = module.get<TaskService>(TaskService);
    taskModel = module.get<Model<Task>>(getModelToken('Task'));

    // Limpa a coleção antes de cada teste
    await taskModel.deleteMany({});
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  // it('should create a task', async () => {

  //   const createTaskDto: CreateTaskDto = {
  //     userId: '1',
  //     title: "task 3",
  //     description: "this is a task 3",
  //     startDate: new Date("2024-05-13T11:30:00.000Z"),
  //     endDate: new Date("2024-05-13T13:00:00.000Z"),
  //     priority: 4
  //   }

  //   const task = await service.create(createTaskDto);

  //   expect(task.title).toBe('task 3');
  // });

  // describe('should not allow the registration of tasks with conflicting times', () => {
    
  //   it('should not register a task whose end time conflicts with the execution time of another task', async () => {

  //     const createTaskDto1: CreateTaskDto = {
  //       userId: '1',
  //       title: "task 4",
  //       description: "this is a task 4",
  //       startDate: new Date("2024-05-13T15:30:00.000Z"),
  //       endDate: new Date("2024-05-13T16:00:00.000Z"),
  //       priority: 4
  //     }

  //     await service.create(createTaskDto1);

  //     const createTaskDto2: CreateTaskDto = {
  //       userId: '1',
  //       title: "task 5",
  //       description: "this is a task 5",
  //       startDate: new Date("2024-05-13T13:00:00.000Z"),
  //       endDate: new Date("2024-05-13T15:50:00.000Z"),
  //       priority: 4
  //   }

  //   await expect(service.create(createTaskDto2))
  //         .rejects.toThrow(TaskSchedulingConflictException)
   
  //   });


  //   it('should not register a task whose start time conflicts with the execution time of another task', async () => {

  //     const createTaskDto1: CreateTaskDto = {
  //       userId: '1',
  //       title: "task 4",
  //       description: "this is a task 4",
  //       startDate: new Date("2024-05-13T15:00:00.000Z"),
  //       endDate: new Date("2024-05-13T16:00:00.000Z"),
  //       priority: 4
  //     }

  //     await service.create(createTaskDto1);

  //     const createTaskDto2: CreateTaskDto = {
  //       userId: '1',
  //       title: "task 5",
  //       description: "this is a task 5",
  //       startDate: new Date("2024-05-13T15:30:00.000Z"),
  //       endDate: new Date("2024-05-13T17:00:00.000Z"),
  //       priority: 4
  //   }

  //   await expect(service.create(createTaskDto2))
  //         .rejects.toThrow(TaskSchedulingConflictException)
   
  //   });

  //   it('should not register a task whose start and end are respectively before and after the duration of another task', async () => {

  //     const createTaskDto1: CreateTaskDto = {
  //       userId: '1',
  //       title: "task 4",
  //       description: "this is a task 4",
  //       startDate: new Date("2024-05-13T10:00:00.000Z"),
  //       endDate: new Date("2024-05-13T12:00:00.000Z"),
  //       priority: 4
  //     }

  //     await service.create(createTaskDto1);

  //     const createTaskDto2: CreateTaskDto = {
  //       userId: '1',
  //       title: "task 5",
  //       description: "this is a task 5",
  //       startDate: new Date("2024-05-13T09:00:00.000Z"),
  //       endDate: new Date("2024-05-13T14:00:00.000Z"),
  //       priority: 4
  //   }

  //   await expect(service.create(createTaskDto2))
  //         .rejects.toThrow(TaskSchedulingConflictException)
   
  //   });

  //   it('should not register a task whose execution time is exactly the same as another task', async () => {

  //     const createTaskDto1: CreateTaskDto = {
  //       userId: '1',
  //       title: "task 4",
  //       description: "this is a task 4",
  //       startDate: new Date("2024-05-13T18:20:00.000Z"),
  //       endDate: new Date("2024-05-13T19:30:00.000Z"),
  //       priority: 4
  //     }

  //     await service.create(createTaskDto1);

  //     const createTaskDto2: CreateTaskDto = {
  //       userId: '1',
  //       title: "task 5",
  //       description: "this is a task 5",
  //       startDate: new Date("2024-05-13T18:20:00.000Z"),
  //       endDate: new Date("2024-05-13T19:30:00.000Z"),
  //       priority: 4
  //   }

  //   await expect(service.create(createTaskDto2))
  //         .rejects.toThrow(TaskSchedulingConflictException)
   
  //   });

  //   it('tasks from different users can contain the same time', async () => {
  //     const createTaskDto1: CreateTaskDto = {
  //       userId: '1',
  //       title: "task 1",
  //       description: "this is a task 1 of user 1",
  //       startDate: new Date("2024-05-13T11:30:00.000Z"),
  //       endDate: new Date("2024-05-13T13:00:00.000Z"),
  //       priority: 4
  //     }
  
  //     await service.create(createTaskDto1);

  //     const createTaskDto2: CreateTaskDto = {
  //       userId: '2',
  //       title: "task 1",
  //       description: "this is a task 1 of user 2",
  //       startDate: new Date("2024-05-13T11:30:00.000Z"),
  //       endDate: new Date("2024-05-13T13:00:00.000Z"),
  //       priority: 4
  //     }
  
  //     const task2 = await service.create(createTaskDto2);
      
  //     expect(task2.startDate.toString())
  //       .toBe(new Date("2024-05-13T11:30:00.000Z").toString());
    
  //   });


  // });

  // describe('task update', () => {

  //   it('should only update the title of a task', async () => {


  //     const createTaskDto: CreateTaskDto = {
  //       userId: '1',
  //       title: "task 3",
  //       description: "this is a task 3",
  //       startDate: new Date("2024-05-13T11:30:00.000Z"),
  //       endDate: new Date("2024-05-13T13:00:00.000Z"),
  //       priority: 4
  //     }
  
  //     const task = await service.create(createTaskDto);
      
  //     const updateTaskDto: UpdateTaskDto = {
  //       description: "this is a task 1000000",
  //     }
  
  //     const taskUpdate = await service.updateTask('1', task._id.toString() , updateTaskDto);
    
  //     expect(taskUpdate.description).toBe("this is a task 1000000");
  //   });

  //   it('should not update a task if its schedule conflicts with another task', async () => {
  //     const createTaskDto1: CreateTaskDto = {
  //       userId: '1',
  //       title: "task 3",
  //       description: "this is a task 3",
  //       startDate: new Date("2024-05-13T11:30:00.000Z"),
  //       endDate: new Date("2024-05-13T13:00:00.000Z"),
  //       priority: 4
  //     }
  
  //     await service.create(createTaskDto1);

  //     const createTaskDto2: CreateTaskDto = {
  //       userId: '1',
  //       title: "task 4",
  //       description: "this is a task 4",
  //       startDate: new Date("2024-05-13T15:30:00.000Z"),
  //       endDate: new Date("2024-05-13T17:00:00.000Z"),
  //       priority: 4
  //     }
  
  //     const task2 = await service.create(createTaskDto2);
      
  //     const updateTaskDto: UpdateTaskDto = {
  //       startDate: new Date("2024-05-13T12:00:00.000Z"),
  //       endDate: new Date("2024-05-13T17:00:00.000Z"),
  //     }
  
  //     await expect(service.updateTask('1', task2._id.toString() , updateTaskDto))
  //       .rejects.toThrow(TaskSchedulingConflictException)
    
  //   });

  //   it('tasks from different users can contain the same time', async () => {
  //     const createTaskDto1: CreateTaskDto = {
  //       userId: '1',
  //       title: "task 1",
  //       description: "this is a task 1 of user 1",
  //       startDate: new Date("2024-05-13T11:30:00.000Z"),
  //       endDate: new Date("2024-05-13T13:00:00.000Z"),
  //       priority: 4
  //     }
  
  //     await service.create(createTaskDto1);

  //     const createTaskDto2: CreateTaskDto = {
  //       userId: '2',
  //       title: "task 1",
  //       description: "this is a task 1 of user 2",
  //       startDate: new Date("2024-05-13T15:30:00.000Z"),
  //       endDate: new Date("2024-05-13T17:00:00.000Z"),
  //       priority: 4
  //     }
  
  //     const task2 = await service.create(createTaskDto2);
      
  //     const updateTaskDto: UpdateTaskDto = {
  //       startDate: new Date("2024-05-13T12:00:00.000Z"),
  //       endDate: new Date("2024-05-13T17:00:00.000Z"),
  //     }
  
  //     const up = await service.updateTask('2', task2._id.toString() , updateTaskDto)
      
  //     expect(up.startDate.toString())
  //       .toBe(new Date("2024-05-13T12:00:00.000Z").toString());
    
  //   });

  // });


  // describe('remove task', () => {
  //   it('should remove a task', async () => {

  //     const createTaskDto: CreateTaskDto = {
  //       userId: '1',
  //       title: "task 3",
  //       description: "this is a task 3",
  //       startDate: new Date("2024-05-13T11:30:00.000Z"),
  //       endDate: new Date("2024-05-13T13:00:00.000Z"),
  //       priority: 4
  //     }
  
  //     const task = await service.create(createTaskDto);

  //     await service.remove(task._id.toString())
      
  //     const find = await taskModel.findOne({_id: task._id})
      
  //     expect(find).toBeNull();
  //   });

  // });
  
  
});
