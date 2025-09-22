import React from 'react';
import { Calendar, Clock, Tag, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { formatDate, formatRelativeDate, getPriorityColor, getStatusColor } from '../../lib/utils';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import type { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const isOverdue = task.status === 'overdue';
  const isCompleted = task.completed;

  return (
    <div className={`card hover:shadow-md transition-shadow duration-200 ${isOverdue ? 'border-l-4 border-l-red-500' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => onToggleComplete(task._id, e.target.checked)}
            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`mt-1 text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
                {task.description}
              </p>
            )}
            
            <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
              {task.dueDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{formatRelativeDate(task.createdAt)}</span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center space-x-2">
              <Badge variant="priority" className={getPriorityColor(task.priority)}>
                {task.priority}
              </Badge>
              
              <Badge variant="status" className={getStatusColor(task.status)}>
                {task.status}
              </Badge>
              
              {task.tags.map((tag) => (
                <Badge key={tag} className="bg-blue-100 text-blue-800 border-blue-200">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="p-2"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task._id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}