import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { UsersService } from '../users/users.service';
import { TaskStatus } from './schemas/task.schema';

@Injectable()
export class TasksScheduler {
  private readonly logger = new Logger(TasksScheduler.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    this.logger.debug('Running task due soon check');

    const now = new Date();

    // Find tasks due soon based on user preferences
    const users = await this.usersService.findAll();

    for (const user of users) {
      if (user.notificationEnabled && user.notificationIntervals.length > 0) {
        for (const interval of user.notificationIntervals) {
          const tasksDueSoon = await this.tasksService.findTasksDueSoon(interval);
          for (const task of tasksDueSoon) {
            // Placeholder for sending notification
            this.logger.warn(
              `Task "${task.title}" (ID: ${task._id}) for user ${user.email} is due in ${interval} minutes on ${task.dueDate}`,
            );
            // In a real application, you would send an email/push notification here
          }
        }
      }
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleOverdueTasks() {
    this.logger.debug('Running overdue tasks check');

    const overdueTasks = await this.tasksService.findOverdueTasks();

    for (const task of overdueTasks) {
      await this.tasksService.updateTaskStatus(task._id, TaskStatus.OVERDUE);
      this.logger.warn(`Task "${task.title}" (ID: ${task._id}) marked as OVERDUE`);
      // Optionally send an overdue notification here as well
    }
  }
}