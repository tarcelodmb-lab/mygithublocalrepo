import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAppContext } from '@/contexts/AppContext';
import { MaintenanceTask, MaintenanceLog } from '@/types/maintenance';
import TaskCard from '@/components/TaskCard';
import { toast } from '@/components/ui/use-toast';
import { Download, LogOut } from 'lucide-react';
import { useTaskCycling } from '@/hooks/useTaskCycling';
import { isMaintenanceDue } from '@/utils/dateCalculations';

const CustomerDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { tasks, logs, addLog, updateTask, checkAndAwardAchievements } = useAppContext();
  const [activeTab, setActiveTab] = useState('daily');
  const [taskNotes, setTaskNotes] = useState<{[key: string]: string}>({});

  // Enable automatic task cycling based on frequency
  useTaskCycling(tasks, updateTask);

  const categories = [
    { id: 'daily', label: 'Daily' },
    { id: 'monthly', label: 'Monthly' },
    { id: 'quarterly', label: 'Quarterly' },
    { id: 'yearly', label: 'Yearly' },
    { id: 'non-printing', label: 'No Print' },
  ];

  const getTasksByCategory = (category: string) => {
    return tasks.filter(task => task.category === category);
  };

  const getCompletionStats = (category: string) => {
    const categoryTasks = getTasksByCategory(category);
    const completed = categoryTasks.filter(task => task.completed).length;
    return { completed, total: categoryTasks.length };
  };

  const handleTaskToggle = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const notes = taskNotes[taskId] || '';
    const updatedTask = {
      completed: !task.completed,
      lastCompleted: !task.completed ? new Date() : task.lastCompleted,
      completedBy: !task.completed ? user?.operatorName || 'User' : task.completedBy,
      notes: !task.completed ? notes : task.notes,
    };
    
    updateTask(taskId, updatedTask);
    
    if (!task.completed) {
      const newLog: MaintenanceLog = {
        id: Date.now().toString(),
        taskId: task.id,
        taskTitle: task.title,
        completedAt: new Date(),
        completedBy: user?.operatorName || 'User',
        notes: notes,
      };
      addLog(newLog);
      
      setTaskNotes(prev => ({ ...prev, [taskId]: '' }));
      checkAndAwardAchievements(taskId);
      
      toast({
        title: 'Task Completed',
        description: `${task.title} has been marked as complete.`,
      });
    }
  };

  const handleNotesChange = (taskId: string, notes: string) => {
    setTaskNotes(prev => ({ ...prev, [taskId]: notes }));
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

    toast({
      title: 'CSV Exported',
      description: 'Maintenance logs exported successfully.',
    });
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const overdueTasks = tasks.filter(t => {
    if (t.completed || t.category === 'non-printing' || !user?.datePurchased) return false;
    const frequency = t.category as 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
    return isMaintenanceDue(user.datePurchased, frequency, t.lastCompleted);
  }).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img 
              src="https://d64gsuwffb70l.cloudfront.net/6852eaa113cfcaf0a3208874_1753880190918_ecbec0d3.png" 
              alt="CobraFlex Logo" 
              className="h-16 w-16 object-contain"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Printer Maintenance Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.operatorName || 'User'}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button onClick={exportLogs} className="bg-red-600 hover:bg-red-700 text-white">
              Email CSV
            </Button>
            <Button onClick={logout} variant="outline" className="border-red-600 text-red-600 hover:bg-red-50">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-red-600">Company Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><span className="font-medium">Company:</span> {user?.companyName || 'N/A'}</div>
              <div><span className="font-medium">Serial:</span> {user?.serialNumber || 'N/A'}</div>
              <div><span className="font-medium">Purchase Date:</span> {user?.datePurchased || 'N/A'}</div>
              <div><span className="font-medium">Timezone:</span> {user?.timezone || 'N/A'}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-red-600">Task Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div><span className="font-medium">Total Tasks:</span> {totalTasks}</div>
              <div><span className="font-medium">Completed:</span> {completedTasks}</div>
              <div><span className="font-medium">Pending:</span> {pendingTasks}</div>
              <div><span className="font-medium">Overdue:</span> {overdueTasks}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-red-600">Awards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-center">0</div>
              <div className="text-center text-gray-600 text-sm">Achievement Points</div>
            </CardContent>
          </Card>
        </div>

        {/* Frequency Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            {categories.map(category => {
              const stats = getCompletionStats(category.id);
              const isActive = activeTab === category.id;
              return (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id} 
                  className={`${isActive && stats.total > 0 && stats.completed === 0 ? 'bg-red-600 text-white' : ''}`}
                >
                  {category.label} {stats.completed}/{stats.total}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category.id} value={category.id}>
              <div className="space-y-4">
                {getTasksByCategory(category.id).map(task => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    taskNotes={taskNotes}
                    onTaskToggle={handleTaskToggle}
                    onNotesChange={handleNotesChange}
                  />
                ))}
                {getTasksByCategory(category.id).length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No {category.label.toLowerCase()} tasks available
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default CustomerDashboard;