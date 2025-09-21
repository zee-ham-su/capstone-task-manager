import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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

  async findAllTasks(userId: string, tags?: string): Promise<Task[]> {
    const filter: any = { userId };
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }
    return this.taskModel.find(filter).exec();
  }

  async findTasksDueSoon(userId: string, intervalInMinutes: number): Promise<Task[]> {
    const now = new Date();
    const future = new Date(now.getTime() + intervalInMinutes * 60 * 1000);

    return this.taskModel.find({
      userId,
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

  async findTaskById(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: id, userId }).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async createTask(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const createdTask = new this.taskModel({ ...createTaskDto, userId });
    return createdTask.save();
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const existingTask = await this.taskModel.findOneAndUpdate(
      { _id: id, userId },
      updateTaskDto,
      { new: true },
    ).exec();

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

  async deleteTask(id: string, userId: string): Promise<any> {
    const result = await this.taskModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { message: `Task with ID ${id} deleted successfully` };
  }
}
