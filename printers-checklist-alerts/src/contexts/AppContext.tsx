import React, { createContext, useContext, useState } from 'react';
import { MaintenanceTask, MaintenanceLog, Award, UserAward } from '@/types/maintenance';
import { maintenanceTasks } from '@/data/maintenanceTasks';
import { awards } from '@/data/awards';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  tasks: MaintenanceTask[];
  logs: MaintenanceLog[];
  awards: Award[];
  userAwards: UserAward[];
  updateTask: (taskId: string, updates: Partial<MaintenanceTask>) => void;
  addLog: (log: MaintenanceLog) => void;
  addTask: (task: MaintenanceTask) => void;
  checkAndAwardAchievements: (taskId: string) => Award[];
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
  tasks: [],
  logs: [],
  awards: [],
  userAwards: [],
  updateTask: () => {},
  addLog: () => {},
  addTask: () => {},
  checkAndAwardAchievements: () => [],
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tasks, setTasks] = useState<MaintenanceTask[]>(maintenanceTasks);
  const [logs, setLogs] = useState<MaintenanceLog[]>([]);
  const [userAwards, setUserAwards] = useState<UserAward[]>([]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const updateTask = (taskId: string, updates: Partial<MaintenanceTask>) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
  };

  const addLog = (log: MaintenanceLog) => {
    setLogs(prev => [log, ...prev]);
  };

  const addTask = (task: MaintenanceTask) => {
    setTasks(prev => [...prev, task]);
  };

  const checkAndAwardAchievements = (taskId: string): Award[] => {
    const newAwards: Award[] = [];
    const earnedAwardIds = userAwards.map(ua => ua.awardId);
    const completedTasks = tasks.filter(t => t.completed).length + 1;
    
    awards.forEach(award => {
      if (earnedAwardIds.includes(award.id)) return;
      
      let shouldAward = false;
      
      if (award.requirement.type === 'tasks_completed') {
        shouldAward = completedTasks >= award.requirement.value;
      } else if (award.requirement.type === 'category_master') {
        const categoryTasks = tasks.filter(t => t.category === award.requirement.category);
        const completedCategoryTasks = categoryTasks.filter(t => t.completed).length;
        shouldAward = completedCategoryTasks >= categoryTasks.length;
      }
      
      if (shouldAward) {
        const userAward: UserAward = {
          id: `${award.id}-${Date.now()}`,
          awardId: award.id,
          earnedAt: new Date(),
          taskId
        };
        setUserAwards(prev => [...prev, userAward]);
        newAwards.push(award);
      }
    });
    
    return newAwards;
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        tasks,
        logs,
        awards,
        userAwards,
        updateTask,
        addLog,
        addTask,
        checkAndAwardAchievements,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};