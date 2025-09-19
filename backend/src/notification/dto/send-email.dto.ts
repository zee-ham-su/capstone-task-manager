import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsObject, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({ example: 'test@example.com', description: 'Recipient email address' })
  @IsEmail()
  to: string;

  @ApiProperty({ example: 'Welcome to Task Manager', description: 'Email subject' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ example: 'welcome', description: 'Name of the email template to use' })
  @IsString()
  template: string;

  @ApiProperty({
    example: { username: 'Hamza', link: 'https://app.com/verify' },
    description: 'Template context data (variables injected into template)',
  })
  @IsObject()
  context: Record<string, any>;
}
