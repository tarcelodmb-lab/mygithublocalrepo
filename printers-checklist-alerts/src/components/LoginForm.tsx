import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import WarrantyModal from './WarrantyModal';
import { Clock } from 'lucide-react';

interface LoginFormProps {
  onLogin: (credentials: LoginCredentials) => void;
  onShowSignup: () => void;
  error?: string;
}

export interface LoginCredentials {
  companyName: string;
  serialNumber: string;
  operatorName: string;
  password: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onShowSignup, error: propError }) => {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    companyName: '',
    serialNumber: '',
    operatorName: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [showWarranty, setShowWarranty] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState<LoginCredentials | null>(null);

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentTime = new Date().toLocaleString();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!credentials.companyName || !credentials.serialNumber || 
        !credentials.operatorName || !credentials.password) {
      setError('All fields are required');
      return;
    }
    
    // Show warranty modal before login
    setPendingCredentials(credentials);
    setShowWarranty(true);
  };

  const handleWarrantyAccept = () => {
    if (pendingCredentials) {
      onLogin(pendingCredentials);
    }
    setShowWarranty(false);
    setPendingCredentials(null);
  };

  const handleWarrantyClose = () => {
    setShowWarranty(false);
    setPendingCredentials(null);
  };

  const handleChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const displayError = error || propError;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/6852eaa113cfcaf0a3208874_1752173430689_6c674b4a.JPG" 
                alt="CobraFlex Logo" 
                className="h-20 w-20 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold">CobraFlex Login</CardTitle>
            <CardDescription>
              Enter your credentials to access the maintenance dashboard
            </CardDescription>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mt-2">
              <Clock className="h-3 w-3" />
              <span>{userTimezone} - {currentTime}</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  type="text"
                  value={credentials.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="Enter company name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number</Label>
                <Input
                  id="serialNumber"
                  type="text"
                  value={credentials.serialNumber}
                  onChange={(e) => handleChange('serialNumber', e.target.value)}
                  placeholder="Enter serial number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="operatorName">Operator Name</Label>
                <Input
                  id="operatorName"
                  type="text"
                  value={credentials.operatorName}
                  onChange={(e) => handleChange('operatorName', e.target.value)}
                  placeholder="Enter operator name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={credentials.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Enter password"
                />
              </div>
              
              {displayError && (
                <Alert variant="destructive">
                  <AlertDescription>{displayError}</AlertDescription>
                </Alert>
              )}
              
              <Button type="submit" className="w-full">
                Login
              </Button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onShowSignup}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign up for one
                  </button>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Admin login: CobraFlex / ADMIN001 / Administrator / admin123
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      
      <WarrantyModal 
        isOpen={showWarranty}
        onClose={handleWarrantyClose}
        onAccept={handleWarrantyAccept}
      />
    </>
  );
};

export default LoginForm;