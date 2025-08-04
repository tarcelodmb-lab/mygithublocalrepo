import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Save, X } from 'lucide-react';

interface CustomerInfo {
  companyName: string;
  serialNumber: string;
  operatorName: string;
  location?: string;
  department?: string;
}

interface CustomerEditDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customerInfo: CustomerInfo;
  onSave: (info: CustomerInfo) => void;
  availableOperators?: string[];
}

const CustomerEditDialog: React.FC<CustomerEditDialogProps> = ({ 
  isOpen, 
  onClose, 
  customerInfo, 
  onSave,
  availableOperators = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson']
}) => {
  const [editedInfo, setEditedInfo] = useState<CustomerInfo>(customerInfo);

  const handleSave = () => {
    onSave(editedInfo);
    onClose();
  };

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setEditedInfo(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Customer Information
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              value={editedInfo.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              placeholder="Enter company name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="serial">Serial Number</Label>
            <Input
              id="serial"
              value={editedInfo.serialNumber}
              onChange={(e) => handleChange('serialNumber', e.target.value)}
              placeholder="Enter serial number"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="operator">Operator</Label>
            <Select 
              value={editedInfo.operatorName} 
              onValueChange={(value) => handleChange('operatorName', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select operator" />
              </SelectTrigger>
              <SelectContent>
                {availableOperators.map(operator => (
                  <SelectItem key={operator} value={operator}>
                    {operator}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              value={editedInfo.location || ''}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Enter location"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="department">Department (Optional)</Label>
            <Input
              id="department"
              value={editedInfo.department || ''}
              onChange={(e) => handleChange('department', e.target.value)}
              placeholder="Enter department"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerEditDialog;