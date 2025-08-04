import { Award } from '../types/maintenance';

export const awards: Award[] = [
  {
    id: 'first-task',
    name: 'First Steps',
    description: 'Complete your first maintenance task',
    icon: '🎯',
    points: 10,
    category: 'bronze',
    requirement: { type: 'tasks_completed', value: 1 }
  },
  {
    id: 'task-master-10',
    name: 'Task Master',
    description: 'Complete 10 maintenance tasks',
    icon: '⭐',
    points: 50,
    category: 'silver',
    requirement: { type: 'tasks_completed', value: 10 }
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Complete tasks for 7 consecutive days',
    icon: '🔥',
    points: 75,
    category: 'gold',
    requirement: { type: 'streak_days', value: 7 }
  },
  {
    id: 'daily-master',
    name: 'Daily Champion',
    description: 'Complete all daily maintenance tasks',
    icon: '☀️',
    points: 30,
    category: 'bronze',
    requirement: { type: 'category_master', value: 1, category: 'daily' }
  },
  {
    id: 'maintenance-legend',
    name: 'Maintenance Legend',
    description: 'Complete 100 maintenance tasks',
    icon: '👑',
    points: 200,
    category: 'platinum',
    requirement: { type: 'tasks_completed', value: 100 }
  }
];