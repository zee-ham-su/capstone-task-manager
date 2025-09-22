import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { UsersService } from '../users/users.service';
import { TaskStatus } from './schemas/task.schema';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class TasksScheduler {
  private readonly logger = new Logger(TasksScheduler.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    this.logger.debug('Running task due soon check');

    const now = new Date();

    // Find tasks due soon based on user preferences
    const users = await this.usersService.findAll();

    for (const user of users) {
      if (user.notificationEnabled && user.notificationIntervals.length > 0) {
        for (const interval of user.notificationIntervals) {
          const tasksDueSoon = await this.tasksService.findTasksDueSoon(String(user._id), interval);
          for (const task of tasksDueSoon) {
            await this.notificationService.sendEmail(
              user.email,
              `Task Reminder: ${task.title}`,
              'task-reminder',
              { 
                name: user.name,
                title: task.title,
                interval,
                dueDate: task.dueDate.toDateString(),
              },
            );
          }
        }
      }
    }
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleOverdueTasks() {
    this.logger.debug('Running overdue tasks check');

    const overdueTasks = await this.tasksService.findOverdueTasks();

    for (const task of overdueTasks) {
      await this.tasksService.updateTaskStatus(task._id, TaskStatus.OVERDUE);
      this.logger.warn(`Task "${task.title}" (ID: ${task._id}) marked as OVERDUE`);
      
      const user = await this.usersService.findOne(task.userId as any);
      if (user && user.notificationEnabled) {
        await this.notificationService.sendEmail(
          user.email,
          `Task Overdue: ${task.title}`,
          'task-reminder',
          { 
            name: user.name,
            title: task.title,
            interval: 0, // Overdue tasks have no interval
            dueDate: task.dueDate.toDateString(),
          },
        );
      }
    }
  }
}