import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserPlus } from 'lucide-react';

interface SignupFormProps {
  onSignup: (userData: SignupData) => void;
  onShowLogin: () => void;
  error?: string;
}

export interface SignupData {
  companyName: string;
  serialNumber: string;
  operatorName: string;
  password: string;
  confirmPassword: string;
  datePurchased: string;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onShowLogin, error: externalError }) => {
  const [userData, setUserData] = useState<SignupData>({
    companyName: '',
    serialNumber: '',
    operatorName: '',
    password: '',
    confirmPassword: '',
    datePurchased: ''
  });
  const [error, setError] = useState('');
  const [warrantyAccepted, setWarrantyAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!userData.companyName || !userData.serialNumber || 
        !userData.operatorName || !userData.password || !userData.confirmPassword || !userData.datePurchased) {
      setError('All fields are required');
      return;
    }

    
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (userData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (!warrantyAccepted) {
      setError('You must accept the warranty terms and conditions');
      return;
    }
    
    onSignup(userData);
  };

  const handleChange = (field: keyof SignupData, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/6852eaa113cfcaf0a3208874_1752173430689_6c674b4a.JPG" 
                alt="CobraFlex Logo" 
                className="h-16 w-16 object-contain"
              />
            </div>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Sign up for CobraFlex maintenance dashboard access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Signup Form */}
              <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={userData.companyName}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      type="text"
                      value={userData.serialNumber}
                      onChange={(e) => handleChange('serialNumber', e.target.value)}
                      placeholder="Enter serial number"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="operatorName">Operator Name</Label>
                    <Input
                      id="operatorName"
                      type="text"
                      value={userData.operatorName}
                      onChange={(e) => handleChange('operatorName', e.target.value)}
                      placeholder="Enter operator name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={userData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      placeholder="Enter password"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={userData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      placeholder="Confirm password"
                    />
                   </div>
                   
                   <div className="space-y-2">
                     <Label htmlFor="datePurchased">Date Purchased</Label>
                     <Input
                       id="datePurchased"
                       type="date"
                       value={userData.datePurchased}
                       onChange={(e) => handleChange('datePurchased', e.target.value)}
                       placeholder="Select purchase date"
                     />
                   </div>
                  
                  <div className="flex items-center space-x-2 pt-4">
                    <Checkbox 
                      id="warranty" 
                      checked={warrantyAccepted}
                      onCheckedChange={(checked) => setWarrantyAccepted(checked as boolean)}
                    />
                    <Label htmlFor="warranty" className="text-sm font-medium">
                      I have read and accept the warranty terms and conditions
                    </Label>
                  </div>
                   {(error || externalError) && (
                     <Alert variant="destructive">
                       <AlertDescription>{error || externalError}</AlertDescription>
                     </Alert>
                   )}
                  
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={onShowLogin}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Login here
                      </button>
                    </p>
                  </div>
                </form>
              </div>
              
              {/* Right Column - Warranty Terms */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-center">Warranty Terms and Conditions</h3>
                <ScrollArea className="h-[600px] w-full border rounded-md p-4">
                  <div className="space-y-4 text-sm">
                    <div className="bg-blue-50 p-3 rounded-md">
                      <h4 className="font-semibold text-blue-800 mb-2">TRAINING</h4>
                      <p className="text-blue-700">
                        Upon purchase, CobraFlex will provide comprehensive training on proper operation, handling, and maintenance. 
                        Training includes digital user manual, training checklist, and documentation on replacement of consumable parts.
                      </p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-md">
                      <h4 className="font-semibold text-green-800 mb-2">Remote Technical Support</h4>
                      <p className="text-green-700">
                        CobraFlex provides remote technical support for 12 months from installation date. 
                        Support hours: Monday-Friday 8AM-5PM PST. Average response time: 6 business hours.
                      </p>
                    </div>
                    
                    <div className="bg-orange-50 p-3 rounded-md">
                      <h4 className="font-semibold text-orange-800 mb-2">Ink & Chemical Policy</h4>
                      <p className="text-orange-700">
                        All warranty coverage is contingent upon exclusive use of CobraFlex-approved consumables. 
                        Use of non-approved materials voids all warranties immediately.
                      </p>
                    </div>
                    
                    <div className="bg-red-50 p-3 rounded-md">
                      <h4 className="font-semibold text-red-800 mb-2">Limited Warranty</h4>
                      <p className="text-red-700">
                        CobraFlex warrants equipment free from defects for 1-2 years depending on model. 
                        Includes prorated print head coverage for 12 months. Customer must maintain proper daily maintenance.
                      </p>
                    </div>
                    
                    <div className="bg-purple-50 p-3 rounded-md">
                      <h4 className="font-semibold text-purple-800 mb-2">Operator Training Requirement</h4>
                      <p className="text-purple-700">
                        All operators must be trained and certified by CobraFlex. Untrained operator use voids warranty. 
                        Customer must submit proof of training for each operator.
                      </p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md">
                      <h4 className="font-semibold text-gray-800 mb-2">Final Sale Terms</h4>
                      <p className="text-gray-700">
                        Once ink is introduced into the printer, sale becomes final and non-returnable. 
                        DOA coverage: 10 business days from installation.
                      </p>
                    </div>
                    
                    <div className="bg-yellow-50 p-3 rounded-md">
                      <h4 className="font-semibold text-yellow-800 mb-2">Important Exclusions</h4>
                      <p className="text-yellow-700">
                        Warranty does not cover: consumable parts, improper installation, environmental damage, 
                        unauthorized service, third-party software issues, or business downtime costs.
                      </p>
                    </div>
                    
                    <div className="bg-indigo-50 p-3 rounded-md">
                      <h4 className="font-semibold text-indigo-800 mb-2">Customer Responsibilities</h4>
                      <p className="text-indigo-700">
                        Maintain proper maintenance logs, use only approved supplies, ensure trained operators, 
                        prepare site per specifications, and report issues immediately.
                      </p>
                    </div>
                    
                    <div className="bg-pink-50 p-3 rounded-md">
                      <h4 className="font-semibold text-pink-800 mb-2">Moving Equipment</h4>
                      <p className="text-pink-700">
                        Moving equipment without written notice voids warranty immediately. 
                        Must follow approved shutdown, transport, and startup protocols.
                      </p>
                    </div>
                    
                    <div className="bg-teal-50 p-3 rounded-md">
                      <h4 className="font-semibold text-teal-800 mb-2">Limitation of Liability</h4>
                      <p className="text-teal-700">
                        Total liability shall not exceed amount paid for equipment. 
                        Customer indemnifies CobraFlex from third-party claims.
                      </p>
                    </div>
                    
                    <div className="bg-cyan-50 p-3 rounded-md">
                      <h4 className="font-semibold text-cyan-800 mb-2">Governing Law</h4>
                      <p className="text-cyan-700">
                        Disputes resolved by binding arbitration in Arizona under Arizona state law. 
                        Warranty registration required within 30 days of delivery.
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignupForm;