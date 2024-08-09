import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './schema/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskSchedulingConflictException } from './exceptions/task-scheduling-conflict.exception';
import { FilterTaskStatus } from './dto/filter-task.dto';



@Injectable()
export class TaskService {

  constructor(
    @InjectModel('Task') private readonly taskModel: Model<Task>
  ){}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const {startDate, endDate, userId} = createTaskDto

    const verifyTime = await this.scheduledTaskAtGivenTime(startDate, endDate, userId)
   
    if (verifyTime.length > 0) {
      throw new TaskSchedulingConflictException()
    }

    const createdTask = new this.taskModel(createTaskDto);

    return createdTask.save();
  }

  async scheduledTaskAtGivenTime(_startDate: Date, _endDate: Date, _userId: string): Promise<Task[]> {

    const find = await this.taskModel.find({
      $and: [
        {userId: _userId},
        {
          $or: [
            {status: 'a fazer'}, // serão considerados horarios conflitantes apenas aqueles
            {status: 'fazendo'}, // que entrarem em conflito com os de tarefas cujo o status seja
          ]                      // "a fazer" ou "fazendo"
        },
        {
        $or: [
          { $and: [{startDate: { $lte: _startDate}}, {endDate: { $gte: _endDate}}]}, //datas conflitantes (inicio e fim) são as mesmas
          { $and: [{startDate: { $lt: _endDate}}, {endDate: { $gte: _endDate}}]}, // o teminio de um tarefa está entre o inicio e o fim de uma outra tarefa
          { $and: [{startDate: { $lte: _startDate}}, {endDate: { $gt: _startDate}}]}, // o inicio de uma tarefa está entre o inicio e o fim de outra
          { $and: [{startDate: { $gte: _startDate}}, {endDate: { $lte: _endDate}}]}, // uma tarefa começa antes e termina depois de outra tarefa
        ]
      }
      ]
    }).exec()

    return find
  }


  findAll(userId: string, filter: FilterTaskStatus): Promise<Task[]> {
    
    return this.taskModel.find({userId: userId, status: filter.status}).exec()
  }

  findOne(userId: string, taskId): Promise<Task> {

    return this.taskModel.findOne({userId: userId, _id: taskId}).exec()
  }


  async updateTask(userId: string, taskId: string, updateTaskDto: UpdateTaskDto): Promise<Task> {

    const {startDate, endDate} = updateTaskDto

    const verifyTask = await this.scheduledTaskAtGivenTime(startDate, endDate, userId)
    
    if (verifyTask.length > 0) {
     
      if ( // nao retornar a exceção caso esteja autualizando a propia task
          verifyTask.length > 1 &&
          verifyTask[0]._id.toString() !== taskId
      ) {
        throw new TaskSchedulingConflictException() 
      }
    }
    
    return this.taskModel.findOneAndUpdate(
      {
        $and: [
          {userId: userId},
          {_id: taskId}
        ]
      },
      updateTaskDto,
      {returnOriginal: false}
    ).exec()

  }

  remove(taskId: string): Promise<Task> {
    return this.taskModel.findOneAndDelete({
      _id: taskId
    })
  }
}
