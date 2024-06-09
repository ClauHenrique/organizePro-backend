import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './schema/task.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {

  constructor(
    @InjectModel('Task') private readonly taskModel: Model<Task>
  ){}

  async create(createTaskDto: CreateTaskDto): Promise<Task[]> {
    try {

      const {startDate, endDate} = createTaskDto


      const scheduledTaskAtGivenTime = await this.taskModel.find({
        $and: [ 
          {startDate: { $gte: startDate}},
          {startDate: { $lte: startDate }} 
        ]
      })
      // $or: [
      //   {startDate: { $gte: startDate, $lte: startDate }}, 
      //   {endDate: { $gte: startDate, $lte: startDate }}
      // ]
// { $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] }
      // if (scheduledTaskAtGivenTime.length > 0) {
      //   console.log(">>", scheduledTaskAtGivenTime);
      //   throw new Error(`Unable to register task.`)
      // }

      // const createdTask = new this.taskModel(createTaskDto);

      // return createdTask.save();
      return scheduledTaskAtGivenTime
    } catch (err) {
      throw new Error(`Unable to register task. ${err}`)
    }
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
