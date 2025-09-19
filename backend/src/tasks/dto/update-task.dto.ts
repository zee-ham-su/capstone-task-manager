import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsDate, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskPriority } from './create-task.dto';

export class UpdateTaskDto {
  @ApiProperty({
    example: 'Complete project documentation',
    description: 'The title of the task',
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example: 'Write comprehensive documentation for the API endpoints',
    description: 'The detailed description of the task',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Whether the task is completed',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  completed?: boolean;

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
    example: TaskPriority.HIGH,
    description: 'The priority level of the task',
    required: false,
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
