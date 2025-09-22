import { apiClient } from './client';
import { Task, CreateTaskDto, UpdateTaskDto, PaginatedResponse, ApiTask } from '@/types';

// Helper function to map API task to frontend task
const mapApiTaskToTask = (apiTask: ApiTask): Task => {
  const { _id, ...rest } = apiTask;
  return {
    ...rest,
    id: _id
  };
};

export const tasksApi = {
  // Get all tasks for the current user
  getTasks: async (params?: Record<string, string>): Promise<PaginatedResponse<Task>> => {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const response = await apiClient.get<any>(`/tasks${queryString ? `?${queryString}` : ''}`);
      
      console.log('Raw API response:', response);
      
      // If response is an array, convert to paginated format
      if (Array.isArray(response)) {
        console.log('Received array response, converting to paginated format');
        return {
          data: response.map(mapApiTaskToTask),
          meta: {
            total: response.length,
            page: 1,
            limit: response.length,
            totalPages: 1
          }
        };
      }
      
      // If response has a data property, it's a paginated response
      if (response && typeof response === 'object' && 'data' in response) {
        console.log('Received paginated response');
        const data = Array.isArray(response.data) ? response.data : [];
        return {
          data: data.map(mapApiTaskToTask),
          meta: {
            total: response.meta?.total || data.length,
            page: response.meta?.page || 1,
            limit: response.meta?.limit || data.length,
            totalPages: response.meta?.totalPages || 1
          }
        };
      }
      
      // If we get here, the response format is unexpected
      console.warn('Unexpected response format:', response);
      return {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      };
    } catch (error) {
      console.error('Error in getTasks:', error);
      // Return empty result instead of throwing to prevent UI crash
      return {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      };
    }
  },

  // Get a single task by ID
  getTask: async (id: string): Promise<Task> => {
    const response = await apiClient.get<ApiTask>(`/tasks/${id}`);
    return mapApiTaskToTask(response);
  },

  // Create a new task
  createTask: async (data: CreateTaskDto): Promise<Task> => {
    const response = await apiClient.post<ApiTask>('/tasks', data);
    return mapApiTaskToTask(response);
  },

  // Update an existing task
  updateTask: async (id: string, data: UpdateTaskDto): Promise<Task> => {
    const response = await apiClient.patch<ApiTask>(`/tasks/${id}`, data);
    return mapApiTaskToTask(response);
  },

  // Delete a task
  deleteTask: async (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/tasks/${id}`);
  },
};
