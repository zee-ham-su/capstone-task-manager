import { Link } from 'react-router-dom';
import { Task } from '@/types';
import { format } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

type TaskStatus = 'todo' | 'inProgress' | 'done' | 'pending';

const statusColors: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-800',
  inProgress: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
};

const getStatusDisplay = (status: string | undefined) => {
  switch (status) {
    case 'inProgress':
      return 'In Progress';
    case 'done':
      return 'Done';
    case 'pending':
      return 'Pending';
    case 'todo':
    default:
      return 'To Do';
  }
};

export default function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
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
            New Task
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <li key={task.id}>
            <Link to={`/tasks/${task.id}`} className="block hover:bg-gray-50">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-primary-600">
                    {task.title}
                  </p>
                  <div className="ml-2 flex flex-shrink-0">
                    <p
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        priorityColors[task.priority]
                      }`}
                    >
                      {task.priority}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {task.description}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Due{' '}
                      <time dateTime={task.dueDate}>
                        {task.dueDate
                          ? format(new Date(task.dueDate), 'MMM d, yyyy')
                          : 'No due date'}
                      </time>
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex space-x-2">
                    {task.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        task.status && statusColors[task.status as TaskStatus] ? 
                        statusColors[task.status as TaskStatus] : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {getStatusDisplay(task.status)}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
