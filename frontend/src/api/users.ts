import { apiClient } from './client';
import { User, UpdateUserDto, PaginatedResponse } from '@/types';

export const usersApi = {
  // Get all users (admin only)
  getUsers: (): Promise<PaginatedResponse<User>> => {
    return apiClient.get('/users');
  },

  // Get current user's profile
  getProfile: (): Promise<User> => {
    return apiClient.get('/users/me');
  },

  // Update current user's profile
  updateProfile: (data: UpdateUserDto): Promise<User> => {
    return apiClient.patch('/users/me', data);
  },

  // Get user by ID (admin only)
  getUser: (id: string): Promise<User> => {
    return apiClient.get(`/users/${id}`);
  },

  // Update user by ID (admin only)
  updateUser: (id: string, data: UpdateUserDto): Promise<User> => {
    return apiClient.patch(`/users/${id}`, data);
  },

  // Delete user by ID (admin only)
  deleteUser: (id: string): Promise<{ message: string }> => {
    return apiClient.delete(`/users/${id}`);
  },
};
