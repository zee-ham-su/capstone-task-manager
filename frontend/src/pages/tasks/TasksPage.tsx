import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { tasksApi } from '@/api/tasks';
import TaskList from '@/components/tasks/TaskList';
import TaskFilters from '@/components/tasks/TaskFilters';

export default function TasksPage() {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    tags: '',
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ['tasks', filters],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.tags) params.tags = filters.tags;
      
      try {
        console.log('Fetching tasks with params:', params);
        const response = await tasksApi.getTasks(params);
        console.log('Tasks API response:', response);
        return response;
      } catch (err) {
        console.error('Error fetching tasks:', err);
        throw err;
      }
    },
  });

  console.log('Tasks data:', data);
  console.log('Is loading:', isLoading);
  console.log('Error:', error);

  const handleFilterChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Tasks</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all your tasks including their details and status.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            to="/tasks/new"
            className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <PlusIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
            Add Task
          </Link>
        </div>
      </div>

      <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FunnelIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error loading tasks
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>Failed to load tasks. Please try again later.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <TaskList tasks={data?.data || []} />
      )}
    </div>
  );
}
