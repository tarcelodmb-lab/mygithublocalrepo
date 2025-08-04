import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, Edit, Building, Hash, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import CustomerEditDialog from './CustomerEditDialog';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { user, logout, updateUser } = useAuth();
  const [showEditDialog, setShowEditDialog] = useState(false);

  if (!user) return null;

  const handleEditSave = (updatedInfo: any) => {
    updateUser({
      ...user,
      companyName: updatedInfo.companyName,
      serialNumber: updatedInfo.serialNumber,
      operatorName: updatedInfo.operatorName,
      location: updatedInfo.location,
      department: updatedInfo.department
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/6852eaa113cfcaf0a3208874_1752166443481_68c7a028.JPG" 
                alt="CobraFlex Logo" 
                className="h-10 w-10 object-contain"
              />
              <h1 className="text-xl font-semibold text-gray-900">
                CobraFlex Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Customer Info Card */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">{user.companyName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Hash className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600">{user.serialNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-gray-600">{user.operatorName}</span>
                        <Badge variant="secondary" className="text-xs">
                          Operator
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEditDialog(true)}
                      className="ml-2"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Button 
                variant="outline" 
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Customer Edit Dialog */}
      <CustomerEditDialog
        isOpen={showEditDialog}
        onClose={() => setShowEditDialog(false)}
        customerInfo={{
          companyName: user.companyName,
          serialNumber: user.serialNumber,
          operatorName: user.operatorName,
          location: user.location,
          department: user.department
        }}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default AppLayout;