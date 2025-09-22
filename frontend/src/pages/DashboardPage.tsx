import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { tasksApi } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Layout } from '../components/layout/Layout';
import { Badge } from '../components/ui/Badge';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react';
import { formatDate, isTaskOverdue, isTaskDueSoon } from '../lib/utils';

export function DashboardPage() {
  const { user } = useAuth();
  
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => tasksApi.getTasks(),
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed && task.status !== 'overdue');
  const overdueTasks = tasks.filter(task => task.status === 'overdue');
  const dueSoonTasks = tasks.filter(task => 
    !task.completed && task.dueDate && isTaskDueSoon(task.dueDate)
  );

  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const stats = [
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Completed',
      value: completedTasks.length,
      icon: CheckCircle2,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Pending',
      value: pendingTasks.length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Overdue',
      value: overdueTasks.length,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's an overview of your tasks and productivity.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="card">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion Rate */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Completion Rate</h2>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex-1 bg-gray-200 rounded-full h-3">
              <div
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
            <span className="text-2xl font-bold text-gray-900">{completionRate}%</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Due Soon Tasks */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Due Soon</h2>
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            {dueSoonTasks.length > 0 ? (
              <div className="space-y-3">
                {dueSoonTasks.slice(0, 5).map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-600">
                        Due {formatDate(task.dueDate!)}
                      </p>
                    </div>
                    <Badge variant="warning" className="ml-2">
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                {dueSoonTasks.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{dueSoonTasks.length - 5} more tasks due soon
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No tasks due soon. Great job staying on top of things!
              </p>
            )}
          </div>

          {/* Overdue Tasks */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Overdue Tasks</h2>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            {overdueTasks.length > 0 ? (
              <div className="space-y-3">
                {overdueTasks.slice(0, 5).map((task) => (
                  <div key={task._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-red-600">
                        Was due {formatDate(task.dueDate!)}
                      </p>
                    </div>
                    <Badge variant="danger" className="ml-2">
                      {task.priority}
                    </Badge>
                  </div>
                ))}
                {overdueTasks.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{overdueTasks.length - 5} more overdue tasks
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No overdue tasks. Excellent work!
              </p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}