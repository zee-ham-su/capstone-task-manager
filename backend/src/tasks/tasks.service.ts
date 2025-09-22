import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument, TaskStatus } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';

/**
 * Service responsible for handling task-related operations
 * @class TasksService
 * @decorator @Injectable()
 */
@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Retrieves all tasks for a specific user, optionally filtered by tags
   * @param {string} userId - The ID of the user whose tasks to retrieve
   * @param {string} [tags] - Optional comma-separated list of tags to filter by
   * @returns {Promise<Task[]>} A promise that resolves to an array of tasks
   * @throws {NotFoundException} If no tasks are found for the user
   */
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

  /**
   * Creates a new task
   * @param {CreateTaskDto} createTaskDto - The data for creating a new task
   * @param {string} userId - The ID of the user who owns the task
   * @returns {Promise<Task>} A promise that resolves to the created task
   */
  async createTask(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const createdTask = new this.taskModel({ ...createTaskDto, userId });
    return createdTask.save();
  }

  /**
   * Updates an existing task
   * @param {string} id - The ID of the task to update
   * @param {UpdateTaskDto} updateTaskDto - The data to update the task with
   * @param {string} userId - The ID of the user who owns the task
   * @returns {Promise<Task>} A promise that resolves to the updated task
   * @throws {NotFoundException} If the task is not found
   * @throws {ForbiddenException} If the user is not authorized to update the task
   */
  async updateTask(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
    // Ensure 'status' is not present in the update payload, as it's managed internally or via 'completed'
    const updatePayload: any = { ...updateTaskDto };
    if ('status' in updatePayload) {
      delete updatePayload.status;
    }

    // Update status based on completed field
    if (typeof updatePayload.completed === 'boolean') {
      updatePayload.status = updatePayload.completed ? TaskStatus.COMPLETED : TaskStatus.PENDING;
    }

    const existingTask = await this.taskModel.findOneAndUpdate(
      { _id: id, userId },
      updatePayload,
      { new: true },
    ).exec();

    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return existingTask;
  }

  /**
   * Updates the status of a task
   * @param {string} taskId - The ID of the task to update
   * @param {TaskStatus} status - The new status of the task
   * @returns {Promise<Task>} A promise that resolves to the updated task
   * @throws {NotFoundException} If the task is not found
   */
  async updateTaskStatus(taskId: string, status: TaskStatus): Promise<Task> {
    const existingTask = await this.taskModel
      .findByIdAndUpdate(taskId, { status }, { new: true })
      .exec();
    if (!existingTask) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return existingTask;
  }

  /**
   * Deletes a task
   * @param {string} id - The ID of the task to delete
   * @param {string} userId - The ID of the user who owns the task
   * @returns {Promise<any>} A promise that resolves when the task is deleted
   * @throws {NotFoundException} If the task is not found
   * @throws {ForbiddenException} If the user is not authorized to delete the task
   */
  async deleteTask(id: string, userId: string): Promise<any> {
    const result = await this.taskModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return { message: `Task with ID ${id} deleted successfully` };
  }

  async getTotalTasksCount(userId: string): Promise<number> {
    return this.taskModel.countDocuments({ userId }).exec();
  }

  async getDueSoonTasksCount(userId: string): Promise<number> {
    const now = new Date();
    const future = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    return this.taskModel.countDocuments({
      userId,
      dueDate: { $gt: now, $lte: future },
      completed: false,
      status: { $ne: TaskStatus.OVERDUE },
    }).exec();
  }

  async getCompletedTasksCount(userId: string): Promise<number> {
    return this.taskModel.countDocuments({ userId, completed: true }).exec();
  }
}
