import { useState, useEffect } from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';

interface TaskFiltersProps {
  filters: {
    status: string;
    priority: string;
    tags: string;
  };
  onFilterChange: (filters: any) => void;
}

export default function TaskFilters({ filters, onFilterChange }: TaskFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalFilters(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const resetFilters = () => {
    const resetFilters = {
      status: '',
      priority: '',
      tags: '',
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold leading-6 text-gray-900">Filters</h3>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <FunnelIcon className="-ml-1 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
            {showFilters ? 'Hide' : 'Show'} filters
          </button>
        </div>

        {showFilters && (
          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={localFilters.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="todo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={localFilters.priority}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary-500 focus:outline-none focus:ring-primary-500 sm:text-sm"
                >
                  <option value="">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  value={localFilters.tags}
                  onChange={handleInputChange}
                  placeholder="e.g. work, personal"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Reset
              </button>
              <button
                type="submit"
                className="inline-flex justify-center rounded-md border border-transparent bg-primary-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Apply Filters
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
