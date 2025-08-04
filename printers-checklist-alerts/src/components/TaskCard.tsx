import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { MaintenanceTask } from '@/types/maintenance';
import { calculateNextMaintenanceDate, formatDateForDisplay, isMaintenanceDue } from '@/utils/dateCalculations';
import { useAuth } from '@/contexts/AuthContext';

interface TaskCardProps {
  task: MaintenanceTask;
  taskNotes: {[key: string]: string};
  onTaskToggle: (taskId: string) => void;
  onNotesChange: (taskId: string, notes: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, taskNotes, onTaskToggle, onNotesChange }) => {
  const { user } = useAuth();

  // Calculate next due date based on purchase date and frequency
  const getNextDueDate = () => {
    if (!user?.datePurchased || task.category === 'non-printing') return null;
    
    const frequency = task.category as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    return calculateNextMaintenanceDate(user.datePurchased, frequency, task.lastCompleted);
  };

  // Check if task is due
  const isDue = () => {
    if (!user?.datePurchased || task.category === 'non-printing') return false;
    
    const frequency = task.category as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    return isMaintenanceDue(user.datePurchased, frequency, task.lastCompleted);
  };

  const nextDue = getNextDueDate();
  const taskIsDue = isDue();

  return (
    <Card className={`border-2 ${taskIsDue && !task.completed ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onTaskToggle(task.id)}
            className="mt-1"
          />
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              {taskIsDue && !task.completed && (
                <Badge variant="destructive" className="ml-2">
                  Overdue
                </Badge>
              )}
            </div>

            {/* Due Date */}
            {nextDue && (
              <div className="text-sm text-gray-600">
                Due: {formatDateForDisplay(nextDue)}
              </div>
            )}

            {/* Operator Notes */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Operator Notes:</label>
              <Textarea
                placeholder="Add notes about this task..."
                value={taskNotes[task.id] || task.notes || ''}
                onChange={(e) => onNotesChange(task.id, e.target.value)}
                className="min-h-[80px] resize-none"
                disabled={task.completed}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;