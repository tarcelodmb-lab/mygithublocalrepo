import { useEffect } from 'react';
import { MaintenanceTask } from '@/types/maintenance';
import { shouldResetTask } from '@/utils/dateCalculations';
import { useAuth } from '@/contexts/AuthContext';

export const useTaskCycling = (
  tasks: MaintenanceTask[], 
  updateTask: (taskId: string, updates: Partial<MaintenanceTask>) => void
) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.datePurchased) return;

    tasks.forEach(task => {
      if (task.category === 'non-printing') return;
      
      const frequency = task.category as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
      
      // Check if task should be reset for new cycle
      if (task.completed && shouldResetTask(user.datePurchased, frequency, task.lastCompleted)) {
        updateTask(task.id, {
          completed: false,
          notes: undefined
        });
      }
    });
  }, [tasks, user?.datePurchased, updateTask]);
};