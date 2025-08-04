import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Settings } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface EmailConfigDialogProps {
  currentEmail?: string;
  onEmailUpdate: (email: string) => void;
}

const EmailConfigDialog: React.FC<EmailConfigDialogProps> = ({ currentEmail, onEmailUpdate }) => {
  const [email, setEmail] = useState(currentEmail || '');
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (!email.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Error',
        description: 'Please enter a valid email format.',
        variant: 'destructive',
      });
      return;
    }

    onEmailUpdate(email);
    setIsOpen(false);
    toast({
      title: 'Email Updated',
      description: 'Maintenance logs will be emailed to this address.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          {currentEmail ? 'Update Email' : 'Set Email'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Email Configuration
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email for maintenance logs"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
            />
            <p className="text-sm text-gray-500">
              Maintenance logs will be emailed to this address when exported.
            </p>
          </div>
          {currentEmail && (
            <div className="text-sm text-gray-600">
              Current email: <span className="font-medium">{currentEmail}</span>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Email
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailConfigDialog;