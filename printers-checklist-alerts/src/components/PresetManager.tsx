import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Save } from 'lucide-react';
import { maintenanceTasks } from '@/data/maintenanceTasks';
import { toast } from '@/components/ui/use-toast';

interface TaskPreset {
  id: string;
  name: string;
  description: string;
  taskIds: string[];
  createdAt: string;
}

const PresetManager: React.FC = () => {
  const [presets, setPresets] = useState<TaskPreset[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    taskIds: [] as string[]
  });

  useEffect(() => {
    const savedPresets = localStorage.getItem('maintenancePresets');
    if (savedPresets) {
      setPresets(JSON.parse(savedPresets));
    }
  }, []);

  const savePresets = (newPresets: TaskPreset[]) => {
    localStorage.setItem('maintenancePresets', JSON.stringify(newPresets));
    setPresets(newPresets);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Preset name is required',
        variant: 'destructive'
      });
      return;
    }

    const preset: TaskPreset = {
      id: editingId || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      taskIds: formData.taskIds,
      createdAt: editingId ? presets.find(p => p.id === editingId)?.createdAt || new Date().toISOString() : new Date().toISOString()
    };

    let newPresets;
    if (editingId) {
      newPresets = presets.map(p => p.id === editingId ? preset : p);
    } else {
      newPresets = [...presets, preset];
    }

    savePresets(newPresets);
    resetForm();
    toast({
      title: 'Success',
      description: `Preset ${editingId ? 'updated' : 'created'} successfully`
    });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', taskIds: [] });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleEdit = (preset: TaskPreset) => {
    setFormData({
      name: preset.name,
      description: preset.description,
      taskIds: preset.taskIds
    });
    setEditingId(preset.id);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    const newPresets = presets.filter(p => p.id !== id);
    savePresets(newPresets);
    toast({
      title: 'Success',
      description: 'Preset deleted successfully'
    });
  };

  const handleTaskToggle = (taskId: string) => {
    setFormData(prev => ({
      ...prev,
      taskIds: prev.taskIds.includes(taskId)
        ? prev.taskIds.filter(id => id !== taskId)
        : [...prev.taskIds, taskId]
    }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Maintenance Task Presets</CardTitle>
            <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
              <Plus className="h-4 w-4 mr-2" />
              Create Preset
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isCreating && (
            <div className="mb-6 p-4 border rounded-lg bg-gray-50">
              <h3 className="font-semibold mb-4">
                {editingId ? 'Edit Preset' : 'Create New Preset'}
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="presetName">Preset Name *</Label>
                  <Input
                    id="presetName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter preset name"
                  />
                </div>
                <div>
                  <Label htmlFor="presetDescription">Description</Label>
                  <Textarea
                    id="presetDescription"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter preset description"
                  />
                </div>
                <div>
                  <Label>Select Tasks</Label>
                  <div className="mt-2 max-h-64 overflow-y-auto border rounded p-3">
                    {maintenanceTasks.map(task => (
                      <div key={task.id} className="flex items-center space-x-2 mb-2">
                        <Checkbox
                          id={task.id}
                          checked={formData.taskIds.includes(task.id)}
                          onCheckedChange={() => handleTaskToggle(task.id)}
                        />
                        <label htmlFor={task.id} className="text-sm cursor-pointer flex-1">
                          <div className="font-medium">{task.title}</div>
                          <div className="text-gray-500">{task.description}</div>
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    {editingId ? 'Update' : 'Create'} Preset
                  </Button>
                  <Button variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {presets.map(preset => (
              <div key={preset.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{preset.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{preset.description}</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {preset.taskIds.map(taskId => {
                        const task = maintenanceTasks.find(t => t.id === taskId);
                        return task ? (
                          <Badge key={taskId} variant="secondary" className="text-xs">
                            {task.title}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                    <p className="text-xs text-gray-500">
                      {preset.taskIds.length} tasks • Created {new Date(preset.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(preset)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDelete(preset.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {presets.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                No presets created yet. Click "Create Preset" to get started.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PresetManager;