import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { authApi } from '@/api/auth';

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine(
  (data) => {
    if (data.newPassword && !data.currentPassword) {
      return false;
    }
    return true;
  },
  {
    message: 'Current password is required to set a new password',
    path: ['currentPassword'],
  }
).refine(
  (data) => {
    if (data.newPassword && data.newPassword.length < 6) {
      return false;
    }
    return true;
  },
  {
    message: 'New password must be at least 6 characters',
    path: ['newPassword'],
  }
).refine(
  (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return false;
    }
    return true;
  },
  {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  }
);

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const queryClient = useQueryClient();

  const { data: userData, isLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => authApi.getMe(),
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: ProfileFormData) => {
      const { currentPassword, newPassword, confirmPassword, ...profileData } = data;
      const updateData: any = { ...profileData };
      
      if (newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }
      
      return authApi.updateMe(updateData);
    },
    onSuccess: (updatedUser: any) => {
      queryClient.setQueryData(['user'], updatedUser);
      toast.success('Profile updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update profile');
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: userData?.name || '',
      email: userData?.email || '',
    },
  });

  // Update form when userData is loaded
  useEffect(() => {
    if (userData) {
      reset({
        name: userData.name || '',
        email: userData.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [userData, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data);
  };

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and settings
        </p>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Personal Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Update your personal details
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6 space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className={`block w-full rounded-md ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address <span className="text-red-500">*</span>
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`block w-full rounded-md ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-200">
              <h4 className="text-lg font-medium text-gray-900">Change Password</h4>
              <p className="mt-1 text-sm text-gray-500">
                Leave these fields empty to keep your current password
              </p>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Current password
                </label>
                <div className="mt-1">
                  <input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    {...register('currentPassword')}
                    className={`block w-full rounded-md ${
                      errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                  />
                  {errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.currentPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  New password
                </label>
                <div className="mt-1">
                  <input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    {...register('newPassword')}
                    className={`block w-full rounded-md ${
                      errors.newPassword ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                  />
                  {errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.newPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm new password
                </label>
                <div className="mt-1">
                  <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    className={`block w-full rounded-md ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Sign out
            </button>
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {updateProfileMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
