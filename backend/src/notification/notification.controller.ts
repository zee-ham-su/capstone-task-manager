import { Body, Controller, Post, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { NotificationService } from './notification.service';
import { SendEmailDto } from './dto/send-email.dto';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('email')
  @ApiOperation({ summary: 'Send an email notification' })
  @ApiResponse({ status: 201, description: 'Email successfully sent.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiBody({ type: SendEmailDto })
  async sendEmail(@Body() dto: SendEmailDto) {
    try {
      await this.notificationService.sendEmail(
        dto.to,
        dto.subject,
        dto.template,
        dto.context,
      );
      return { success: true, message: `Email sent to ${dto.to}` };
    } catch (error) {
      throw new HttpException(
        { success: false, message: 'Failed to send email', error: error.message },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
