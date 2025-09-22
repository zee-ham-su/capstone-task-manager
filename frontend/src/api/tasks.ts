import { apiClient } from './client';
import { Task, CreateTaskDto, UpdateTaskDto, PaginatedResponse } from '@/types';

export const tasksApi = {
  // Get all tasks for the current user
  getTasks: (params?: Record<string, string>): Promise<PaginatedResponse<Task>> => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return apiClient.get(`/tasks${queryString ? `?${queryString}` : ''}`);
  },

  // Get a single task by ID
  getTask: (id: string): Promise<Task> => {
    return apiClient.get(`/tasks/${id}`);
  },

  // Create a new task
  createTask: (data: CreateTaskDto): Promise<Task> => {
    return apiClient.post('/tasks', data);
  },

  // Update an existing task
  updateTask: (id: string, data: UpdateTaskDto): Promise<Task> => {
    return apiClient.patch(`/tasks/${id}`, data);
  },

  // Delete a task
  deleteTask: (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/tasks/${id}`);
  },
};
