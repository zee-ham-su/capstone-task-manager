import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskDocument } from './schemas/task.schema';
import { EntityNotFoundException } from '../common/exceptions/entity-not-found.exception';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const createdTask = new this.taskModel({ ...createTaskDto, userId });
    return createdTask.save();
  }

  async findAll(userId: string, tags?: string): Promise<Task[]> {
    const filter: any = { userId };
    if (tags) {
      filter.tags = { $in: tags.split(',') };
    }
    return this.taskModel.find(filter).exec();
  }

  async findAllTasks(): Promise<Task[]> {
    return this.taskModel.find().exec();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskModel.findOne({ _id: id, userId }).exec();
    if (!task) {
      throw new EntityNotFoundException('Task');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    const updatedTask = await this.taskModel
      .findOneAndUpdate({ _id: id, userId }, updateTaskDto, { new: true })
      .exec();
    if (!updatedTask) {
      throw new EntityNotFoundException('Task');
    }
    return updatedTask;
  }

  async remove(id: string, userId: string): Promise<Task> {
    const deletedTask = await this.taskModel.findOneAndDelete({ _id: id, userId }).exec();
    if (!deletedTask) {
      throw new EntityNotFoundException('Task');
    }
    return deletedTask;
  }
}
