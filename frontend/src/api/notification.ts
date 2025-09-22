import { apiClient } from './client';
import { SendEmailDto } from '@/types';

export const notificationApi = {
  // Send an email notification
  sendEmail: (data: SendEmailDto): Promise<{ success: boolean; message: string }> => {
    return apiClient.post('/notification/email', data);
  },
};
