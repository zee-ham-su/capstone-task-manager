import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly usersService: UsersService,
  ) {}

  async findAllTasks(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async findTasksDueSoon(intervalInMinutes: number): Promise<Task[]> {
    const now = new Date();
    const future = new Date(now.getTime() + intervalInMinutes * 60 * 1000);

    return this.taskModel.find({
      dueDate: { $gt: now, $lte: future },
      completed: false,
      status: { $ne: TaskStatus.OVERDUE },
    }).exec();
  }

  async findOverdueTasks(): Promise<Task[]> {
    const now = new Date();
    return this.taskModel.find({
      dueDate: { $lt: now },
      completed: false,
      status: { $ne: TaskStatus.OVERDUE },
    }).exec();
  }

  async findTaskById(id: string): Promise<Task> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const existingTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return existingTask;
  }

  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const existingTask = await this.taskModel
      .findByIdAndUpdate(taskId, { status }, { new: true })
      .exec();
    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return existingTask;
  }

  async deleteTask(id: string): Promise<any> {
    const result = await this.taskModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { message: `Task with ID ${id} deleted successfully` };
  }
}
