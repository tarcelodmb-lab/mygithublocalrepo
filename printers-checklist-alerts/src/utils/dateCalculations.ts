// Utility functions for calculating maintenance dates based on purchase date

export const calculateNextMaintenanceDate = (
  purchaseDate: string,
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
  lastCompleted?: Date
): Date => {
  const baseDate = lastCompleted || new Date(purchaseDate);
  const today = new Date();
  
  // Calculate the next occurrence based on frequency
  switch (frequency) {
    case 'daily':
      // Next day after last completed or today
      const nextDay = new Date(baseDate);
      nextDay.setDate(baseDate.getDate() + 1);
      return nextDay;
      
    case 'weekly':
      // Next week from last completed or purchase date
      const nextWeek = new Date(baseDate);
      nextWeek.setDate(baseDate.getDate() + 7);
      return nextWeek;
      
    case 'monthly':
      // Next month from last completed or purchase date
      const nextMonth = new Date(baseDate);
      nextMonth.setMonth(baseDate.getMonth() + 1);
      return nextMonth;
      
    case 'quarterly':
      // Next quarter from last completed or purchase date
      const nextQuarter = new Date(baseDate);
      nextQuarter.setMonth(baseDate.getMonth() + 3);
      return nextQuarter;
      
    case 'yearly':
      // Next year from last completed or purchase date
      const nextYear = new Date(baseDate);
      nextYear.setFullYear(baseDate.getFullYear() + 1);
      return nextYear;
      
    default:
      return today;
  }
};

export const isMaintenanceDue = (
  purchaseDate: string,
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
  lastCompleted?: Date
): boolean => {
  const nextDue = calculateNextMaintenanceDate(purchaseDate, frequency, lastCompleted);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  nextDue.setHours(0, 0, 0, 0);
  
  return today >= nextDue;
};

export const shouldResetTask = (
  purchaseDate: string,
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly',
  lastCompleted?: Date
): boolean => {
  if (!lastCompleted) return false;
  
  const nextDue = calculateNextMaintenanceDate(purchaseDate, frequency, lastCompleted);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  nextDue.setHours(0, 0, 0, 0);
  
  return today >= nextDue;
};

export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};