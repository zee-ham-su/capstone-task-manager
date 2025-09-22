export interface User {
  _id: string;
  name: string;
  email: string;
  roles: string[];
  notificationEnabled: boolean;
  notificationIntervals: number[];
  notificationType: 'email' | 'push';
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  status: 'pending' | 'completed' | 'overdue';
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  completed?: boolean;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  password?: string;
  notificationEnabled?: boolean;
  notificationIntervals?: number[];
  notificationType?: 'email' | 'push';
}