import { Award, UserAward } from '../types/maintenance';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Trophy, Star } from 'lucide-react';

interface AwardsPanelProps {
  awards: Award[];
  userAwards: UserAward[];
  totalTasks: number;
  streakDays: number;
}

export function AwardsPanel({ awards, userAwards, totalTasks, streakDays }: AwardsPanelProps) {
  const earnedAwardIds = userAwards.map(ua => ua.awardId);
  const totalPoints = userAwards.reduce((sum, ua) => {
    const award = awards.find(a => a.id === ua.awardId);
    return sum + (award?.points || 0);
  }, 0);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getProgress = (award: Award) => {
    const { requirement } = award;
    if (requirement.type === 'tasks_completed') {
      return Math.min(100, (totalTasks / requirement.value) * 100);
    }
    if (requirement.type === 'streak_days') {
      return Math.min(100, (streakDays / requirement.value) * 100);
    }
    return 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Awards & Achievements</span>
        </CardTitle>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-blue-500" />
            <span>{totalPoints} points</span>
          </div>
          <div>{userAwards.length}/{awards.length} awards earned</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {awards.map(award => {
            const isEarned = earnedAwardIds.includes(award.id);
            const progress = getProgress(award);
            
            return (
              <div key={award.id} className={`p-3 rounded-lg border ${
                isEarned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`text-2xl ${isEarned ? '' : 'grayscale opacity-50'}`}>
                      {award.icon}
                    </div>
                    <div>
                      <h4 className="font-medium">{award.name}</h4>
                      <p className="text-sm text-gray-600">{award.description}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getCategoryColor(award.category)}>
                          {award.category.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-blue-600">
                          {award.points} points
                        </span>
                      </div>
                    </div>
                  </div>
                  {isEarned && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      Earned
                    </Badge>
                  )}
                </div>
                {!isEarned && (
                  <div className="mt-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round(progress)}% complete
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}