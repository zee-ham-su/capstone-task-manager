import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { NotificationType } from '../schemas/user.schema';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'The email address of the user',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'newpassword123',
    description: 'The new password for the user account',
    required: false,
    minLength: 6,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    example: true,
    description: 'Enable or disable notifications',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  notificationEnabled?: boolean;

  @ApiProperty({
    example: [30, 1440],
    description: 'Notification intervals in minutes',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  notificationIntervals?: number[];

  @ApiProperty({
    example: NotificationType.EMAIL,
    description: 'Notification type',
    enum: NotificationType,
    required: false,
  })
  @IsOptional()
  @IsEnum(NotificationType)
  notificationType?: NotificationType;
}
