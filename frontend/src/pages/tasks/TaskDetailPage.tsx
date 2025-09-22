import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/api/tasks';
import { Task } from '@/types';
import { format } from 'date-fns';
import { TrashIcon, PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import TaskForm from '@/components/tasks/TaskForm';

type Priority = 'low' | 'medium' | 'high';

const priorityColors: Record<Priority, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

// Status colors are now handled by getStatusColor function

// Removed unused LocationState interface

interface TaskDetailPageProps {
  isNew?: boolean;
}

export default function TaskDetailPage({ isNew = false }: TaskDetailPageProps) {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(isNew);
  
  // If we're creating a new task, don't try to fetch it
  const isCreating = isNew;

  const { data: task, isLoading, error } = useQuery({
    queryKey: ['task', id],
    queryFn: () => {
      if (!id) {
        throw new Error('Task ID is required');
      }
      return tasksApi.getTask(id);
    },
    enabled: !!id && !isCreating,
  });
  
  // Create a default task for the form when creating a new task
  const defaultTask: Task = {
    id: '',
    title: '',
    description: '',
    status: 'todo',
    completed: false,
    priority: 'medium',
    dueDate: new Date().toISOString().split('T')[0],
    tags: [],
    userId: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const deleteMutation = useMutation({
    mutationFn: () => tasksApi.deleteTask(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      navigate('/tasks');
    },
  });
  
  const createOrUpdateMutation = useMutation({
    mutationFn: (data: any) => {
      if (isCreating) {
        return tasksApi.createTask(data);
      } else {
        return tasksApi.updateTask(id!, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      if (isCreating) {
        navigate('/tasks');
      } else {
        setIsEditing(false);
      }
    },
  });

  const handleUpdateSuccess = () => {
    setIsEditing(false);
    queryClient.invalidateQueries({ queryKey: ['task', id] });
  };


  const getStatusText = (status?: string, completed?: boolean) => {
    if (completed) return 'Completed';
    switch (status) {
      case 'inProgress':
        return 'In Progress';
      case 'done':
        return 'Done';
      case 'todo':
      default:
        return 'To Do';
    }
  };

  const getStatusColor = (status?: string, completed?: boolean) => {
    if (completed) return 'bg-green-100 text-green-800';
    switch (status) {
      case 'inProgress':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'todo':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading && !isCreating) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if ((error || !task) && !isCreating) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading task
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{(error as Error)?.message || 'Task not found'}</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
              >
                Back to tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {isCreating ? 'Create New Task' : 'Edit Task'}
        </h1>
        <TaskForm 
          task={isCreating ? defaultTask : task} 
          onSuccess={handleUpdateSuccess} 
          onSubmit={(data) => createOrUpdateMutation.mutate(data as any)}
          isSubmitting={createOrUpdateMutation.isPending}
        />
      </div>
    );
  }
  
  if (!task) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">No task found</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>The requested task could not be found.</p>
            </div>
            <div className="mt-4">
              <button
                type="button"
                onClick={() => navigate('/tasks')}
                className="rounded-md bg-yellow-50 px-2 py-1.5 text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50"
              >
                Back to tasks
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="pb-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
            </div>
            <div className="mt-2 flex items-center space-x-4">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  getStatusColor(task.status, task.completed)
                }`}
              >
                {getStatusText(task.status, task.completed)}
              </span>
              {task.priority && (
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    priorityColors[task.priority as Priority] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              )}
            </div>
            {task.dueDate && (
              <div className="mt-2">
                <span className="text-sm text-gray-500">
                  Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </span>
              </div>
            )}
          </div>
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <PencilIcon className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => deleteMutation.mutate()}
              className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
            >
              <TrashIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Task Details</h3>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          {task.description && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-500">Description</h4>
              <div className="mt-1 text-sm text-gray-900">
                <p className="whitespace-pre-line">{task.description}</p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Created</h4>
              <div className="mt-1 text-sm text-gray-900">
                {task.createdAt && format(new Date(task.createdAt), 'MMM d, yyyy')}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
              <div className="mt-1 text-sm text-gray-900">
                {task.updatedAt && format(new Date(task.updatedAt), 'MMM d, yyyy')}
              </div>
            </div>
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-500">Tags</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {task.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
