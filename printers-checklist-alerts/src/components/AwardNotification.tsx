import { Award } from '../types/maintenance';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { X } from 'lucide-react';

interface AwardNotificationProps {
  award: Award;
  onClose: () => void;
}

export function AwardNotification({ award, onClose }: AwardNotificationProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Card className="fixed top-4 right-4 z-50 w-80 border-2 border-green-500 bg-white shadow-lg animate-in slide-in-from-right">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{award.icon}</div>
            <div>
              <h3 className="font-semibold text-green-700">Award Earned!</h3>
              <p className="font-medium">{award.name}</p>
              <p className="text-sm text-gray-600">{award.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getCategoryColor(award.category)}>
                  {award.category.toUpperCase()}
                </Badge>
                <span className="text-sm font-medium text-blue-600">
                  +{award.points} points
                </span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}