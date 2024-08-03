import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../auth/auth.guard';
import { FilterTaskStatus } from './dto/filter-task.dto';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: Request) {
    createTaskDto.userId = req['user'].sub
    
    return this.taskService.create(createTaskDto);
  }

  @Post('/findall')
  findAll(@Req() req: Request, @Body() filterSatus: FilterTaskStatus) {
    const userId = req['user'].sub
    return this.taskService.findAll(userId, filterSatus);
  }

  @Get(':id')
  findOne(@Req() req: Request,  @Param('id') taskId: string) {
    const userId = req['user'].sub
    return this.taskService.findOne(userId, taskId);
  }


  @Patch(':id')
  updateTask(@Body() updateTaskDto: UpdateTaskDto, @Req() req: Request, @Param('id') taskId: string) {
    const userId = req['user'].sub;
    return this.taskService.updateTask(userId, taskId, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
