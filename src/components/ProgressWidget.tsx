import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Flame, 
  TrendingUp, 
  Calendar, 
  CheckCircle, 
  Circle,
  Trophy,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressWidgetProps {
  goal: number;
  current: number;
  points: number;
  rank: number;
  delta?: number; // change since yesterday
  streakDays: boolean[]; // [Mon, Tue, Wed, Thu, Fri, Sat, Sun]
  className?: string;
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const ProgressWidget: React.FC<ProgressWidgetProps> = ({
  goal,
  current,
  points,
  rank,
  delta,
  streakDays,
  className
}) => {
  const progressPercentage = Math.min((current / goal) * 100, 100);
  const currentStreak = calculateCurrentStreak(streakDays);
  const isGoalMet = current >= goal;

  function calculateCurrentStreak(days: boolean[]): number {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i]) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  const getDeltaDisplay = () => {
    if (!delta) return null;
    const isPositive = delta > 0;
    return (
      <div className={cn(
        'flex items-center gap-1 text-sm font-medium',
        isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
      )}>
        <TrendingUp className={cn('h-3 w-3', !isPositive && 'rotate-180')} />
        {isPositive ? '+' : ''}{delta}
      </div>
    );
  };

  return (
    <Card className={cn('border-[#0056D2]/15', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-[#0F172A] dark:text-[#F1F5F9]">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-[#0056D2]" />
            My Progress
          </div>
          <Badge variant="outline" className="bg-[#0056D2]/10 text-[#0056D2] border-[#0056D2]/20">
            Rank #{rank}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Points and Rank */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0056D2] mb-1">
              {points}
            </div>
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8] flex items-center justify-center gap-1">
              <Zap className="h-3 w-3" />
              Points this week
            </div>
            {getDeltaDisplay()}
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#06B6D4] mb-1">
              #{rank}
            </div>
            <div className="text-sm text-[#64748B] dark:text-[#94A3B8] flex items-center justify-center gap-1">
              <Trophy className="h-3 w-3" />
              Current rank
            </div>
          </div>
        </div>

        {/* Goal Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
              Weekly Goal
            </span>
            <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">
              {current} / {goal}
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3 mb-2"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              {isGoalMet ? 'Goal achieved! 🎉' : `${goal - current} sessions to go`}
            </span>
            <span className="text-xs font-medium text-[#0056D2]">
              {Math.round(progressPercentage)}%
            </span>
          </div>
        </div>

        {/* Daily Streak */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
                Daily Streak
              </span>
            </div>
            <Badge 
              variant={currentStreak > 0 ? 'default' : 'secondary'}
              className={cn(
                'text-xs',
                currentStreak > 0 
                  ? 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
                  : ''
              )}
            >
              {currentStreak} day{currentStreak !== 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {DAY_NAMES.map((day, index) => (
              <div
                key={day}
                className="text-center"
              >
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8] mb-1">
                  {day}
                </div>
                <div className={cn(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors',
                  streakDays[index]
                    ? 'bg-[#0056D2] border-[#0056D2] text-white'
                    : 'border-[#0056D2]/20 text-[#64748B] dark:text-[#94A3B8]'
                )}>
                  {streakDays[index] ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="bg-[#0056D2]/5 dark:bg-[#0056D2]/10 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-[#0056D2]" />
            <span className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9]">
              Sprint Tips
            </span>
          </div>
          <ul className="text-xs text-[#64748B] dark:text-[#94A3B8] space-y-1">
            <li>• Book sessions daily to maintain your streak</li>
            <li>• Complete sessions to earn bonus points</li>
            <li>• Rate sessions 5★ for extra credit</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressWidget;
