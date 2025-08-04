import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Trash2, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface TaskPreset {
  id: string;
  name: string;
  description: string;
  taskIds: string[];
  createdAt: string;
}

interface UserAssignment {
  id: string;
  userEmail: string;
  serialNumber: string;
  presetId: string;
  presetName: string;
  assignedAt: string;
}

const UserPresetAssignment: React.FC = () => {
  const [presets, setPresets] = useState<TaskPreset[]>([]);
  const [assignments, setAssignments] = useState<UserAssignment[]>([]);
  const [formData, setFormData] = useState({
    userEmail: '',
    serialNumber: '',
    presetId: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedPresets = localStorage.getItem('maintenancePresets');
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }

    const savedAssignments = localStorage.getItem('userPresetAssignments');
    if (savedAssignments) {
      setAssignments(JSON.parse(savedAssignments));
    }
  }, []);

  const saveAssignments = (newAssignments: UserAssignment[]) => {
    localStorage.setItem('userPresetAssignments', JSON.stringify(newAssignments));
    setAssignments(newAssignments);
  };

  const handleAssign = () => {
    if (!formData.userEmail || !formData.serialNumber || !formData.presetId) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        variant: 'destructive'
      });
      return;
    }

    // Check if assignment already exists
    const existingAssignment = assignments.find(
      a => a.userEmail === formData.userEmail && a.serialNumber === formData.serialNumber
    );

    if (existingAssignment) {
      toast({
        title: 'Error',
        description: 'This user/serial number combination already has a preset assigned',
        variant: 'destructive'
      });
      return;
    }

    const preset = presets.find(p => p.id === formData.presetId);
    if (!preset) {
      toast({
        title: 'Error',
        description: 'Selected preset not found',
        variant: 'destructive'
      });
      return;
    }

    const assignment: UserAssignment = {
      id: Date.now().toString(),
      userEmail: formData.userEmail,
      serialNumber: formData.serialNumber,
      presetId: formData.presetId,
      presetName: preset.name,
      assignedAt: new Date().toISOString()
    };

    const newAssignments = [...assignments, assignment];
    saveAssignments(newAssignments);

    setFormData({ userEmail: '', serialNumber: '', presetId: '' });
    toast({
      title: 'Success',
      description: 'Preset assigned successfully'
    });
  };

  const handleRemoveAssignment = (id: string) => {
    const newAssignments = assignments.filter(a => a.id !== id);
    saveAssignments(newAssignments);
    toast({
      title: 'Success',
      description: 'Assignment removed successfully'
    });
  };

  const filteredAssignments = assignments.filter(assignment =>
    assignment.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    assignment.presetName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Assign Presets to Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="userEmail">User Email *</Label>
                <Input
                  id="userEmail"
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                  placeholder="user@example.com"
                />
              </div>
              <div>
                <Label htmlFor="serialNumber">Serial Number *</Label>
                <Input
                  id="serialNumber"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, serialNumber: e.target.value }))}
                  placeholder="Enter serial number"
                />
              </div>
              <div>
                <Label htmlFor="preset">Preset *</Label>
                <Select value={formData.presetId} onValueChange={(value) => setFormData(prev => ({ ...prev, presetId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preset" />
                  </SelectTrigger>
                  <SelectContent>
                    {presets.map(preset => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.name} ({preset.taskIds.length} tasks)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAssign} className="w-full">
              <UserCheck className="h-4 w-4 mr-2" />
              Assign Preset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Assignments</CardTitle>
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search assignments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAssignments.map(assignment => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{assignment.userEmail}</p>
                      <p className="text-sm text-gray-600">Serial: {assignment.serialNumber}</p>
                    </div>
                    <Badge variant="secondary">
                      {assignment.presetName}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Assigned {new Date(assignment.assignedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveAssignment(assignment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {filteredAssignments.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                {searchTerm ? 'No assignments match your search.' : 'No preset assignments yet.'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserPresetAssignment;