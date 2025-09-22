import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { usersApi } from '../lib/api';
import { Layout } from '../components/layout/Layout';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { User, Settings, Bell, Shield } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  notificationEnabled: z.boolean(),
  notificationType: z.enum(['email', 'push']),
  notificationIntervals: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      notificationEnabled: user?.notificationEnabled ?? true,
      notificationType: user?.notificationType || 'email',
      notificationIntervals: user?.notificationIntervals?.join(', ') || '30, 1440',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: usersApi.updateMe,
    onSuccess: (updatedUser) => {
      updateUser(updatedUser);
      queryClient.setQueryData(['user'], updatedUser);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    },
    onError: () => {
      setMessage('Failed to update profile. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      const intervals = data.notificationIntervals
        .split(',')
        .map(interval => parseInt(interval.trim()))
        .filter(interval => !isNaN(interval));

      await updateProfileMutation.mutateAsync({
        name: data.name,
        email: data.email,
        notificationEnabled: data.notificationEnabled,
        notificationType: data.notificationType,
        notificationIntervals: intervals,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  const notificationTypeOptions = [
    { value: 'email', label: 'Email' },
    { value: 'push', label: 'Push Notifications' },
  ];

  if (!user) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="card">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Personal Information
                      </h2>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          label="Full Name"
                          placeholder="Enter your full name"
                          error={errors.name?.message}
                          {...register('name')}
                        />
                        
                        <Input
                          label="Email Address"
                          type="email"
                          placeholder="Enter your email"
                          error={errors.email?.message}
                          {...register('email')}
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-900 mb-3">Account Status</h3>
                      <div className="flex flex-wrap gap-2">
                        {user.roles.map((role) => (
                          <Badge key={role} variant="primary">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Notification Preferences
                      </h2>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            id="notificationEnabled"
                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            {...register('notificationEnabled')}
                          />
                          <label htmlFor="notificationEnabled" className="text-sm font-medium text-gray-700">
                            Enable notifications
                          </label>
                        </div>

                        <Select
                          label="Notification Type"
                          options={notificationTypeOptions}
                          error={errors.notificationType?.message}
                          {...register('notificationType')}
                        />

                        <Input
                          label="Notification Intervals (minutes)"
                          placeholder="30, 1440"
                          helperText="Comma-separated values for when to receive reminders before due date"
                          error={errors.notificationIntervals?.message}
                          {...register('notificationIntervals')}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Security Settings
                      </h2>
                      
                      <div className="space-y-4">
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <h3 className="font-medium text-yellow-800 mb-2">Password Reset</h3>
                          <p className="text-sm text-yellow-700 mb-3">
                            To change your password, you'll need to use the forgot password feature.
                          </p>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={() => window.location.href = '/forgot-password'}
                          >
                            Reset Password
                          </Button>
                        </div>

                        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                          <h3 className="font-medium text-gray-800 mb-2">Account Created</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button
                    type="submit"
                    isLoading={isLoading}
                    disabled={activeTab === 'security'}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}