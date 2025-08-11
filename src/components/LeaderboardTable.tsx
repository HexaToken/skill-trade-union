import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, Flame, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardItem {
  rank: number;
  user: {
    id: string;
    name: string;
    avatar: string;
    country: string;
  };
  value: number;
  streak?: number;
  delta?: number; // change since yesterday
  lastActive?: string;
}

interface LeaderboardTableProps {
  metric: 'teachingSessions' | 'learningHours' | 'avgRating' | 'skillsCompleted';
  items: LeaderboardItem[];
  currentUserId?: string;
  showWinners?: boolean;
  className?: string;
}

const METRIC_LABELS = {
  teachingSessions: 'Teaching Sessions',
  learningHours: 'Learning Hours',
  avgRating: 'Avg Rating',
  skillsCompleted: 'Skills Completed'
};

const METRIC_SUFFIXES = {
  teachingSessions: 'sessions',
  learningHours: 'hours',
  avgRating: '/5.0',
  skillsCompleted: 'skills'
};

const FLAG_EMOJIS: Record<string, string> = {
  'US': '🇺🇸',
  'CA': '🇨🇦',
  'UK': '🇬🇧',
  'FR': '🇫🇷',
  'DE': '🇩🇪',
  'ES': '🇪🇸',
  'IT': '🇮🇹',
  'AU': '🇦🇺',
  'JP': '🇯🇵',
  'KR': '🇰🇷',
  'CN': '🇨🇳',
  'IN': '🇮🇳',
  'BR': '🇧🇷',
  'MX': '🇲🇽',
  'AR': '🇦🇷'
};

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  metric,
  items,
  currentUserId,
  showWinners = false,
  className
}) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-[#64748B] dark:text-[#94A3B8]">#{rank}</span>;
    }
  };

  const formatValue = (value: number, metric: string) => {
    if (metric === 'avgRating') {
      return value.toFixed(1);
    }
    return value.toString();
  };

  const getDeltaIcon = (delta?: number) => {
    if (!delta) return null;
    if (delta > 0) {
      return <TrendingUp className="h-3 w-3 text-green-500" />;
    } else if (delta < 0) {
      return <TrendingDown className="h-3 w-3 text-red-500" />;
    }
    return null;
  };

  const getDeltaText = (delta?: number) => {
    if (!delta) return '';
    const sign = delta > 0 ? '+' : '';
    return `${sign}${delta}`;
  };

  // Top 3 winners display
  if (showWinners && items.length >= 3) {
    return (
      <Card className={cn('mb-6', className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Sprint Winners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {items.slice(0, 3).map((item, index) => (
              <div
                key={item.user.id}
                className={cn(
                  'text-center p-4 rounded-lg border-2',
                  index === 0 && 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20',
                  index === 1 && 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/20',
                  index === 2 && 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20'
                )}
              >
                <div className="flex justify-center mb-3">
                  {getRankIcon(item.rank)}
                </div>
                <Avatar className="h-16 w-16 mx-auto mb-3">
                  <AvatarImage src={item.user.avatar} alt={item.user.name} />
                  <AvatarFallback className="bg-[#0056D2]/10 text-[#0056D2] font-bold">
                    {item.user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
                  {item.user.name}
                </h3>
                <div className="text-2xl font-bold text-[#0056D2] mb-2">
                  {formatValue(item.value, metric)}
                  <span className="text-sm text-[#64748B] dark:text-[#94A3B8] ml-1">
                    {METRIC_SUFFIXES[metric]}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-xs',
                    index === 0 && 'bg-yellow-100 text-yellow-700 border-yellow-300',
                    index === 1 && 'bg-gray-100 text-gray-700 border-gray-300',
                    index === 2 && 'bg-amber-100 text-amber-700 border-amber-300'
                  )}
                >
                  {index === 0 ? '+100' : index === 1 ? '+50' : '+25'} credits
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-[#0F172A] dark:text-[#F1F5F9]">
          {METRIC_LABELS[metric]} Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border border-[#0056D2]/10">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#0056D2]/5 hover:bg-[#0056D2]/5">
                <TableHead className="w-16">Rank</TableHead>
                <TableHead>Participant</TableHead>
                <TableHead className="text-center">Country</TableHead>
                <TableHead className="text-center">{METRIC_LABELS[metric]}</TableHead>
                <TableHead className="text-center">Streak</TableHead>
                <TableHead className="text-center">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow
                  key={item.user.id}
                  className={cn(
                    'hover:bg-[#0056D2]/5 transition-colors',
                    item.user.id === currentUserId && 'bg-[#06B6D4]/10 border-[#06B6D4]/30'
                  )}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-center">
                      {getRankIcon(item.rank)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.user.avatar} alt={item.user.name} />
                        <AvatarFallback className="bg-[#0056D2]/10 text-[#0056D2] text-xs font-bold">
                          {item.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                          {item.user.name}
                        </div>
                        {item.lastActive && (
                          <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                            Active {item.lastActive}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-lg">
                      {FLAG_EMOJIS[item.user.country] || '🌍'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-bold text-[#0056D2]">
                      {formatValue(item.value, metric)}
                      <span className="text-xs text-[#64748B] dark:text-[#94A3B8] ml-1">
                        {METRIC_SUFFIXES[metric]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.streak ? (
                      <div className="flex items-center justify-center gap-1">
                        <Flame className="h-4 w-4 text-orange-500" />
                        <span className="font-semibold text-orange-600">
                          {item.streak}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#64748B] dark:text-[#94A3B8]">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {item.delta ? (
                      <div className="flex items-center justify-center gap-1">
                        {getDeltaIcon(item.delta)}
                        <span className={cn(
                          'text-sm font-medium',
                          item.delta > 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {getDeltaText(item.delta)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#64748B] dark:text-[#94A3B8]">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardTable;
