import { HttpException, HttpStatus } from '@nestjs/common';

export class TaskSchedulingConflictException extends HttpException {
  constructor() {
    super('A task is already scheduled at this time.', HttpStatus.CONFLICT);
  }
}
