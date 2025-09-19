import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from './tasks.service';

@Injectable()
export class TasksScheduler {
  private readonly logger = new Logger(TasksScheduler.name);

  constructor(private readonly tasksService: TasksService) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Running task due date check');

    const now = new Date();
    const twentyFourHoursFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const tasks = await this.tasksService.findAllTasks();

    for (const task of tasks) {
      if (task.dueDate && task.dueDate > now && task.dueDate < twentyFourHoursFromNow) {
        this.logger.warn(`Task "${task.title}" (ID: ${task._id}) is due soon on ${task.dueDate}`);
      }
    }
  }
}