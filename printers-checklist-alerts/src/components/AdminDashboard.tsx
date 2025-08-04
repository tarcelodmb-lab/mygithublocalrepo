import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useAppContext } from '@/contexts/AppContext';
import { UserTrackingPanel } from '@/components/UserTrackingPanel';
import { ExportLogsButton } from '@/components/ExportLogsButton';
import PresetManager from '@/components/PresetManager';
import UserPresetAssignment from '@/components/UserPresetAssignment';
import { Users, Settings, Plus, Edit, Trash2, Shield, Activity, List, UserCheck } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive';
  printerModel: string;
  warrantyExpiry: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks, addTask } = useAppContext();
  const [activeTab, setActiveTab] = useState('tracking');
  const [customers] = useState<Customer[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      company: 'ABC Printing',
      status: 'active',
      printerModel: 'CobraFlex Pro',
      warrantyExpiry: '2025-12-31'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      company: 'XYZ Graphics',
      status: 'active',
      printerModel: 'CobraFlex Standard',
      warrantyExpiry: '2024-08-15'
    }
  ]);

  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    estimatedTime: ''
  });

  const handleAddGlobalTask = () => {
    if (!newTaskForm.title || !newTaskForm.category) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields',
        variant: 'destructive'
      });
      return;
    }

    const task = {
      id: Date.now().toString(),
      title: newTaskForm.title,
      description: newTaskForm.description,
      category: newTaskForm.category,
      priority: newTaskForm.priority as 'low' | 'medium' | 'high',
      estimatedTime: newTaskForm.estimatedTime,
      completed: false
    };

    addTask(task);
    setNewTaskForm({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      estimatedTime: ''
    });

    toast({
      title: 'Task Added',
      description: 'Global maintenance task has been added successfully'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
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
                <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Manage customers and system settings</p>
                <p className="text-sm text-gray-500">Timezone: {user?.timezone || 'UTC'}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ExportLogsButton />
              <Badge variant="secondary" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Administrator
              </Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="tracking" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              User Tracking
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Global Tasks
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              Presets
            </TabsTrigger>
            <TabsTrigger value="assignments" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracking">
            <UserTrackingPanel />
          </TabsContent>

          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customers.map(customer => (
                    <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{customer.name}</h3>
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        <p className="text-sm text-gray-600">{customer.company}</p>
                        <p className="text-sm text-gray-600">Model: {customer.printerModel}</p>
                        <p className="text-sm text-gray-600">Warranty: {customer.warrantyExpiry}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                          {customer.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle>Add Global Maintenance Task</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Task Title *</Label>
                    <Input
                      id="title"
                      value={newTaskForm.title}
                      onChange={(e) => setNewTaskForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter task title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newTaskForm.description}
                      onChange={(e) => setNewTaskForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Enter task description"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={newTaskForm.category} onValueChange={(value) => setNewTaskForm(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="non-printing">Non-printing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="priority">Priority</Label>
                      <Select value={newTaskForm.priority} onValueChange={(value) => setNewTaskForm(prev => ({ ...prev, priority: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="estimatedTime">Estimated Time</Label>
                    <Input
                      id="estimatedTime"
                      value={newTaskForm.estimatedTime}
                      onChange={(e) => setNewTaskForm(prev => ({ ...prev, estimatedTime: e.target.value }))}
                      placeholder="e.g., 15 minutes"
                    />
                  </div>
                  <Button onClick={handleAddGlobalTask} className="w-full">
                    Add Global Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="presets">
            <PresetManager />
          </TabsContent>

          <TabsContent value="assignments">
            <UserPresetAssignment />
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">System settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;