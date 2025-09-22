// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

// Task Types
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'inProgress' | 'done';
  tags?: string[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'inProgress' | 'done';
  tags?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'todo' | 'inProgress' | 'done';
  tags?: string[];
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  password: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Notification Types
export interface SendEmailDto {
  to: string;
  subject: string;
  template: string;
  context: Record<string, any>;
}
