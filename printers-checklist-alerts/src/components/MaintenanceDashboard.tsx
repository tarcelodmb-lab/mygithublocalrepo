import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MaintenanceTask, MaintenanceLog, Award } from '@/types/maintenance';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Download, Trophy } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import AddTaskDialog from '@/components/AddTaskDialog';
import EmailConfigDialog from '@/components/EmailConfigDialog';
import TaskCard from '@/components/TaskCard';
import { AwardsPanel } from '@/components/AwardsPanel';
import { AwardNotification } from '@/components/AwardNotification';

const MaintenanceDashboard: React.FC = () => {
  const { tasks, logs, awards, userAwards, updateTask, addLog, addTask, checkAndAwardAchievements } = useAppContext();
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('daily');
  const [showAwardsPanel, setShowAwardsPanel] = useState(false);
  const [newAwards, setNewAwards] = useState<Award[]>([]);
  const [taskNotes, setTaskNotes] = useState<{[key: string]: string}>({});

  const categories = [
    { id: 'daily', label: 'Daily', icon: '📅' },
    { id: 'weekly', label: 'Weekly', icon: '📊' },
    { id: 'monthly', label: 'Monthly', icon: '📈' },
    { id: 'quarterly', label: 'Quarterly', icon: '📋' },
    { id: 'yearly', label: 'Yearly', icon: '📆' },
    { id: 'non-printing', label: 'Non-printing', icon: '⏸️' },
  ];

  const handleAddTask = (newTask: Omit<MaintenanceTask, 'id' | 'completed'>) => {
    const task: MaintenanceTask = {
      ...newTask,
      id: Date.now().toString(),
      completed: false,
    };
    addTask(task);
    toast({
      title: 'Task Added',
      description: `${task.title} has been added to ${task.category} tasks.`,
    });
  };

  const handleTaskToggle = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const notes = taskNotes[taskId] || '';
    const updatedTask = {
      completed: !task.completed,
      lastCompleted: !task.completed ? new Date() : task.lastCompleted,
      completedBy: !task.completed ? 'Current User' : task.completedBy,
      notes: !task.completed ? notes : task.notes,
    };
    
    updateTask(taskId, updatedTask);
    
    if (!task.completed) {
      const newLog: MaintenanceLog = {
        id: Date.now().toString(),
        taskId: task.id,
        taskTitle: task.title,
        completedAt: new Date(),
        completedBy: 'Current User',
        notes: notes,
      };
      addLog(newLog);
      
      setTaskNotes(prev => ({ ...prev, [taskId]: '' }));
      
      const earnedAwards = checkAndAwardAchievements(taskId);
      if (earnedAwards.length > 0) {
        setNewAwards(earnedAwards);
      }
      
      toast({
        title: 'Task Completed',
        description: `${task.title} has been marked as complete.`,
      });
    }
  };

  const handleNotesChange = (taskId: string, notes: string) => {
    setTaskNotes(prev => ({ ...prev, [taskId]: notes }));
  };

  const handleEmailUpdate = (email: string) => {
    if (user) {
      updateUser({ ...user, email });
    }
  };

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.category === category);
  };

  const getCompletionStats = (category: string) => {
    const categoryTasks = getTasksByCategory(category);
    const completed = categoryTasks.filter(task => task.completed).length;
    return { completed, total: categoryTasks.length };
  };

  const exportLogs = () => {
    const csvContent = [
      ['Task', 'Completed At', 'Completed By', 'Notes'],
      ...logs.map(log => [
        log.taskTitle,
        log.completedAt.toLocaleString(),
        log.completedBy,
        log.notes || ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'maintenance-logs.csv';
    a.click();
    URL.revokeObjectURL(url);

    if (user?.email) {
      toast({
        title: 'Logs Exported',
        description: `Maintenance logs exported and will be emailed to ${user.email}`,
      });
    } else {
      toast({
        title: 'Logs Exported',
        description: 'Maintenance logs exported. Set up email to receive logs automatically.',
      });
    }
  };

  const totalCompletedTasks = tasks.filter(t => t.completed).length;
  const streakDays = 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/6852eaa113cfcaf0a3208874_1752166443481_68c7a028.JPG" 
                alt="CobraFlex Logo" 
                className="h-16 w-16 object-contain"
              />
              <div>
                <h1 className="text-4xl font-bold text-gray-900">CobraFlex Maintenance Dashboard</h1>
                <p className="text-gray-600">Track and manage your printer maintenance tasks</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => setShowAwardsPanel(!showAwardsPanel)} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Trophy className="h-4 w-4" />
                Awards
              </Button>
              <EmailConfigDialog 
                currentEmail={user?.email} 
                onEmailUpdate={handleEmailUpdate} 
              />
              <AddTaskDialog onAddTask={handleAddTask} />
              <Button onClick={exportLogs} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Logs
              </Button>
            </div>
          </div>
        </div>

        {showAwardsPanel && (
          <div className="mb-8">
            <AwardsPanel 
              awards={awards} 
              userAwards={userAwards} 
              totalTasks={totalCompletedTasks}
              streakDays={streakDays}
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{tasks.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter(t => t.completed && t.lastCompleted && 
                  new Date(t.lastCompleted).toDateString() === new Date().toDateString()).length}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Awards Earned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{userAwards.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            {categories.map(category => {
              const stats = getCompletionStats(category.id);
              return (
                <TabsTrigger key={category.id} value={category.id} className="flex flex-col gap-1">
                  <span>{category.icon}</span>
                  <span className="text-xs">{category.label}</span>
                  <Badge variant="secondary" className="text-xs">
                    {stats.completed}/{stats.total}
                  </Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {category.label} Maintenance Tasks
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getTasksByCategory(category.id).map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      taskNotes={taskNotes}
                      onTaskToggle={handleTaskToggle}
                      onNotesChange={handleNotesChange}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {newAwards.map((award, index) => (
        <AwardNotification
          key={`${award.id}-${index}`}
          award={award}
          onClose={() => setNewAwards(prev => prev.filter((_, i) => i !== index))}
        />
      ))}
    </div>
  );
};

export { MaintenanceDashboard };
export default MaintenanceDashboard;