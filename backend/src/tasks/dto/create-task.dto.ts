import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDate, IsEnum, IsArray, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

export class CreateTaskDto {
  @ApiProperty({
    example: '60d0fe4f5e3a66001c8c4a00',
    description: 'The ID of the user who owns the task',
    required: false,
  })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiProperty({
    example: 'Complete project documentation',
    description: 'The title of the task',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: 'Write comprehensive documentation for the API endpoints',
    description: 'The detailed description of the task',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: '2025-12-31T23:59:59.999Z',
    description: 'The due date for the task',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dueDate?: Date;

  @ApiProperty({
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
    description: 'The priority level of the task',
    default: TaskPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({
    example: ['work', 'project'],
    description: 'Tags associated with the task',
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
