import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'The task has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input.' })
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.createTask(createTaskDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks for the current user' })
  @ApiResponse({ status: 200, description: 'Return all tasks for the current user.' })
  @ApiQuery({ name: 'tags', required: false, description: 'Comma-separated list of tags to filter by' })
  findAll(@Request() req, @Query('tags') tags?: string) {
    return this.tasksService.findAllTasks(req.user.userId, tags);
  }

  @Get('/summary')
  @ApiOperation({ summary: 'Get task summary counts for the current user' })
  @ApiResponse({ status: 200, description: 'Return task summary counts.' })
  async getTaskSummary(@Request() req) {
    const userId = req.user.userId;
    const totalTasks = await this.tasksService.getTotalTasksCount(userId);
    const dueSoonTasks = await this.tasksService.getDueSoonTasksCount(userId);
    const completedTasks = await this.tasksService.getCompletedTasksCount(userId);
    return {
      totalTasks,
      dueSoonTasks,
      completedTasks,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiResponse({ status: 200, description: 'Return the task.' })
  @ApiResponse({ status: 404, description: 'Task not found.' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.tasksService.findTaskById(id, req.user.userId);
  }

}
