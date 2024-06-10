import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './schema/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TaskSchedulingConflictException } from './exceptions/task-scheduling-conflict.exception';

@Injectable()
export class TaskService {

  constructor(
    @InjectModel('Task') private readonly taskModel: Model<Task>
  ){}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const {startDate, endDate} = createTaskDto

    const scheduledTaskAtGivenTime = await this.taskModel.find({
      $or: [
        { $and: [{startDate: { $lte: startDate}}, {endDate: { $gte: endDate}}]}, //datas conflitantes (inicio e fim) são as mesmas
        { $and: [{startDate: { $lt: endDate}}, {endDate: { $gte: endDate}}]}, // o teminio de um tarefa está entre o inicio e o fim de uma outra tarefa
        { $and: [{startDate: { $lte: startDate}}, {endDate: { $gt: startDate}}]}, // o inicio de uma tarefa está entre o inicio e o fim de outra
        { $and: [{startDate: { $gte: startDate}}, {endDate: { $lte: endDate}}]}, // uma tarefa começa antes e termina depois de outra tarefa
      ]
    })
    
    if (scheduledTaskAtGivenTime.length > 0) {
      throw new TaskSchedulingConflictException()
    }

    const createdTask = new this.taskModel(createTaskDto);

    return createdTask.save();
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
