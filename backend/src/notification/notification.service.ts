import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(
    to: string,
    subject: string,
    template: string,
    context: Record<string, any>,
  ): Promise<void> {
    this.logger.log(`Sending email to ${to} with template: ${template} and context: ${JSON.stringify(context)}`);
    try {
      await this.mailerService.sendMail({
        to,
        subject,
        template, // e.g. 'task-reminder'
        context,  // variables for the template
      });
      this.logger.log(`Email sent to ${to} with subject: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
    }
  }

  async sendPushNotification(userId: string, title: string, body: string): Promise<void> {
    // Placeholder for push notifications
    this.logger.log(
      `Push notification to user ${userId} | ${title}: ${body}`,
    );
  }
}
