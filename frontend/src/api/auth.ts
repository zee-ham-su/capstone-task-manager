import { apiClient } from './client';
import { LoginCredentials, AuthResponse, ForgotPasswordDto, ResetPasswordDto } from '@/types';

export const authApi = {
  login: (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/auth/login', credentials);
  },

  register: (userData: any): Promise<{ message: string }> => {
    return apiClient.post('/auth/register', userData);
  },

  forgotPassword: (data: ForgotPasswordDto): Promise<{ message: string }> => {
    return apiClient.post('/auth/forgot-password', data);
  },

  resetPassword: (data: ResetPasswordDto): Promise<{ message: string }> => {
    return apiClient.post('/auth/reset-password', data);
  },

  getMe: (): Promise<any> => {
    return apiClient.get('/users/me');
  },

  updateMe: (data: any): Promise<any> => {
    return apiClient.patch('/users/me', data);
  },
};
