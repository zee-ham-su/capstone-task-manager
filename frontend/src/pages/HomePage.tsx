import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '@/api/tasks';
import { format } from 'date-fns';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function HomePage() {
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['recent-tasks'],
    queryFn: () => tasksApi.getTasks({ limit: '5', sort: '-dueDate' }),
  });

  return (
    <div className="space-y-8">
      <div className="pb-5 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-500">
          Welcome back! Here's what's happening with your tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-primary-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Tasks
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {isLoading ? '...' : tasks?.meta?.total || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6">
            <div className="text-sm">
              <Link
                to="/tasks"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                View all tasks
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tasks Due Soon
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {isLoading
                        ? '...'
                        : tasks?.data?.filter(
                            (task) =>
                              task.dueDate &&
                              new Date(task.dueDate) > new Date() &&
                              new Date(task.dueDate) <=
                                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          ).length || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6">
            <div className="text-sm">
              <Link
                to="/tasks?filter=due-soon"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                View due soon
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <svg
                  className="h-6 w-6 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Completed Tasks
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {isLoading
                        ? '...'
                        : tasks?.data?.filter((task) => task.status === 'done')
                            .length || 0}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6">
            <div className="text-sm">
              <Link
                to="/tasks?status=done"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                View completed
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Recent Tasks
            </h3>
            <Link
              to="/tasks/new"
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="-ml-1 mr-1 h-3 w-3" />
              Add Task
            </Link>
          </div>
        </div>
        <div className="bg-white overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
            </div>
          ) : tasks?.data && tasks.data.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {tasks.data.map((task) => (
                <li key={task.id}>
                  <Link
                    to={`/tasks/${task.id}`}
                    className="block hover:bg-gray-50 px-4 py-4 sm:px-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-primary-600 truncate">
                          {task.title}
                        </p>
                        <p className="mt-1 flex items-center text-sm text-gray-500">
                          {task.description && (
                            <span className="truncate">{task.description}</span>
                          )}
                        </p>
                      </div>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            task.status === 'done'
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'inProgress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {task.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          {task.dueDate
                            ? `Due ${format(new Date(task.dueDate), 'MMM d, yyyy')}`
                            : 'No due date'}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>
                          Created on {format(new Date(task.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new task.
              </p>
              <div className="mt-6">
                <Link
                  to="/tasks/new"
                  className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                >
                  <PlusIcon className="-ml-0.5 mr-1.5 h-4 w-4" />
                  New Task
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
