export interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  category: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'non-printing';
  completed: boolean;
  lastCompleted?: Date;
  completedBy?: string;
  notes?: string;
  nextDue?: Date;
  purchaseDate?: string;
}

export interface MaintenanceLog {
  id: string;
  taskId: string;
  taskTitle: string;
  completedAt: Date;
  completedBy: string;
  printerSerial?: string;
  notes?: string;
}

export interface Printer {
  id: string;
  serial: string;
  name: string;
  model: string;
}

export interface Award {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  category: 'bronze' | 'silver' | 'gold' | 'platinum';
  requirement: {
    type: 'tasks_completed' | 'streak_days' | 'category_master';
    value: number;
    category?: string;
  };
}

export interface UserAward {
  id: string;
  awardId: string;
  earnedAt: Date;
  taskId?: string;
}