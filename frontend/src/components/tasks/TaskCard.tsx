import React from 'react';
import { Task } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Circle,
  AlertTriangle 
} from 'lucide-react';
import { 
  formatDate, 
  formatRelativeTime, 
  isTaskOverdue, 
  isTaskDueSoon,
  getPriorityColor,
  getStatusColor,
  capitalizeFirst 
} from '../../lib/utils';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) {
  const isOverdue = isTaskOverdue(task.dueDate);
  const isDueSoon = isTaskDueSoon(task.dueDate);

  return (
    <div className="card-hover group">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          {/* Completion Toggle */}
          <button
            onClick={() => onToggleComplete(task._id, !task.completed)}
            className="mt-1 text-gray-400 hover:text-primary-600 transition-colors"
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>

          {/* Task Content */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium text-gray-900 ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Task Meta */}
            <div className="flex items-center space-x-4 mt-3">
              {/* Due Date */}
              {task.dueDate && (
                <div className={`flex items-center space-x-1 text-xs ${
                  isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : 'text-gray-500'
                }`}>
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(task.dueDate)}</span>
                  {(isOverdue || isDueSoon) && (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                </div>
              )}

              {/* Created Time */}
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                <span>{formatRelativeTime(task.createdAt)}</span>
              </div>
            </div>

            {/* Tags and Status */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                {/* Priority Badge */}
                <Badge 
                  variant="secondary" 
                  className={getPriorityColor(task.priority)}
                >
                  {capitalizeFirst(task.priority)}
                </Badge>

                {/* Status Badge */}
                <Badge 
                  variant="secondary"
                  className={getStatusColor(task.status)}
                >
                  {capitalizeFirst(task.status)}
                </Badge>

                {/* Tags */}
                {task.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
                {task.tags.length > 2 && (
                  <Badge variant="default" size="sm">
                    +{task.tags.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="p-2"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task._id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}