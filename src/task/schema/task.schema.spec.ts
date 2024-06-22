import mongoose from 'mongoose';
import {TaskSchema} from './task.schema'

describe('Task schema tests', () => {

    let conn: mongoose.Mongoose;

    beforeEach(async () => {
      conn = await mongoose.connect('mongodb://mongo:27017/mydb');
    });

    afterEach(async () => {
      await conn.disconnect();
    });

    it('create task', async () => {
        const TaskModel = conn.model('Task', TaskSchema);
        const task = new TaskModel({
            userId: "1",
            title: "task 1",
            description: "this is a task 1",
            startDate: "2024-05-05T10:00:00.000Z",
            endDate: "2024-05-05T11:30:00.000Z",
            priority: 4
        });
        await task.save();
  
        const taskCreated = await TaskModel.findById(task._id);
  
        expect(taskCreated.title).toBe('task 1');
      });

});