import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '@/api/tasks';
import { Task, CreateTaskDto, UpdateTaskDto } from '@/types';
import { PlusIcon } from '@heroicons/react/24/outline';

// Base schema without status for creation
const baseTaskSchema = {
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Priority is required',
  }),
  tags: z.string().optional(),
};

// Schema for creating a new task (no status field)
const createTaskSchema = z.object({
  ...baseTaskSchema
});

// Schema for updating a task (includes status)
const updateTaskSchema = z.object({
  ...baseTaskSchema,
  completed: z.boolean().optional(),
});

type TaskFormData = z.infer<typeof createTaskSchema> & {
  status?: 'todo' | 'inProgress' | 'done';
  completed?: boolean;
};

/**
 * Props for the TaskForm component
 * @interface TaskFormProps
 * @property {Task} [task] - The task to edit (if in edit mode)
 * @property {() => void} [onSuccess] - Callback function called after successful form submission
 * @property {(data: CreateTaskDto | UpdateTaskDto) => void} onSubmit - Function to handle form submission
 * @property {boolean} [isSubmitting] - Whether the form is currently submitting
 */
interface TaskFormProps {
  /**
   * The task to edit (if in edit mode)
   */
  task?: Task;
  /**
   * Callback function called after successful form submission
   */
  onSuccess?: () => void;
  /**
   * Function to handle form submission
   */
  onSubmit: (data: CreateTaskDto | UpdateTaskDto) => void;
  /**
   * Whether the form is currently submitting
   */
  isSubmitting?: boolean;
}

/**
 * A form component for creating or editing a task
 * @component
 * @param {TaskFormProps} props - The component props
 * @returns {JSX.Element} The rendered form component
 * 
 * @example
 * // Create a new task
 * <TaskForm onSubmit={handleSubmit} />
 * 
 * @example
 * // Edit an existing task
 * <TaskForm task={task} onSubmit={handleUpdate} />
 */
export default function TaskForm({ task, onSuccess, onSubmit, isSubmitting }: TaskFormProps) {
  const isEdit = Boolean(task?.id); // Only true if we have a task with an ID
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<TaskFormData>({
    resolver: zodResolver(isEdit ? updateTaskSchema : createTaskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      priority: task?.priority || 'medium',
      tags: task?.tags?.join(', ') || '',
      ...(isEdit && { status: task?.status || 'todo' }),
    },
  });

  /**
   * Handles form submission by processing the form data and calling the onSubmit callback
   * @param {TaskFormData} formData - The raw form data
   */
  const handleFormSubmit = (formData: TaskFormData) => {
    const { title, description, dueDate, priority, tags, status } = formData;

    const processedTags = tags ? tags.split(',').map(tag => tag.trim()) : [];

    let taskData: Partial<CreateTaskDto & UpdateTaskDto> = {
      title,
      description,
      dueDate,
      priority,
      tags: processedTags,
    };
    
    if (isEdit) {
      taskData.completed = status === 'done';
    } else {
      // Ensure no completed field is sent for creation
      delete taskData.completed;
    }
    if (onSubmit) {
      onSubmit(taskData);
    } else if (isEdit && task) {
      // Fallback to default implementation if onSubmit is not provided
      const updateMutation = useMutation({
        mutationFn: () => tasksApi.updateTask(task.id, taskData as UpdateTaskDto),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          onSuccess?.();
          if (!onSuccess) {
            navigate('/tasks');
          }
        },
      });
      updateMutation.mutate();
    } else {
      // Fallback to default implementation if onSubmit is not provided
      const createMutation = useMutation({
        mutationFn: () => tasksApi.createTask(taskData as CreateTaskDto),
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          reset();
          onSuccess?.();
          if (!onSuccess) {
            navigate('/tasks');
          }
        },
      });
      createMutation.mutate();
    }
  };

  const isLoading = isSubmitting || false;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="title"
              {...register('title')}
              className={`block w-full rounded-md ${errors.title ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              placeholder="Task title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              rows={3}
              {...register('description')}
              className={`block w-full rounded-md ${errors.description ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              placeholder="Task description"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <div className="mt-1">
              <input
                type="date"
                id="dueDate"
                {...register('dueDate')}
                className={`block w-full rounded-md ${errors.dueDate ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              />
            </div>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
              Priority
            </label>
            <select
              id="priority"
              {...register('priority')}
              className={`mt-1 block w-full rounded-md ${errors.priority ? 'border-red-300' : 'border-gray-300'} py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm`}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {isEdit && (
          <div className="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                {...register('status')}
                className="block w-full px-3 py-2 mt-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="todo">To Do</option>
                <option value="inProgress">In Progress</option>
                <option value="done">Done</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="tags"
              {...register('tags')}
              className={`block w-full rounded-md ${errors.tags ? 'border-red-300' : 'border-gray-300'} shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm`}
              placeholder="work, personal, urgent"
            />
            <p className="mt-1 text-xs text-gray-500">
              Separate tags with commas
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="inline-flex items-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isLoading ? (
            'Saving...'
          ) : (
            <>
              <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              {isEdit ? 'Update Task' : 'Create Task'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
