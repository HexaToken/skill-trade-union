import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Clock, Globe, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface JoinSprintCardProps {
  sprintTitle: string;
  sprintId: string;
  isJoined?: boolean;
  onJoin?: (data: JoinSprintData) => void;
  className?: string;
}

interface JoinSprintData {
  roles: ('mentor' | 'learner')[];
  timeWindows: string[];
  onlineOnly: boolean;
}

const TIME_WINDOWS = [
  'Early Morning (6-9 AM)',
  'Morning (9-12 PM)',
  'Afternoon (12-3 PM)',
  'Evening (3-6 PM)',
  'Night (6-9 PM)',
  'Late Night (9 PM+)'
];

const JoinSprintCard: React.FC<JoinSprintCardProps> = ({
  sprintTitle,
  sprintId,
  isJoined = false,
  onJoin,
  className
}) => {
  const { toast } = useToast();
  const [roles, setRoles] = useState<('mentor' | 'learner')[]>(['learner']);
  const [timeWindows, setTimeWindows] = useState<string[]>([]);
  const [onlineOnly, setOnlineOnly] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleToggle = (role: 'mentor' | 'learner') => {
    setRoles(prev => {
      if (prev.includes(role)) {
        // Don't allow removing the last role
        if (prev.length === 1) return prev;
        return prev.filter(r => r !== role);
      } else {
        return [...prev, role];
      }
    });
  };

  const handleTimeWindowToggle = (window: string) => {
    setTimeWindows(prev => {
      if (prev.includes(window)) {
        return prev.filter(w => w !== window);
      } else {
        return [...prev, window];
      }
    });
  };

  const handleJoin = async () => {
    if (roles.length === 0) {
      toast({
        title: "Select a role",
        description: "Please choose if you want to join as a mentor, learner, or both.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const joinData: JoinSprintData = {
        roles,
        timeWindows,
        onlineOnly
      };

      await onJoin?.(joinData);
      
      toast({
        title: "You're in! 🎉",
        description: `You've joined ${sprintTitle}. Your sessions in this category will count toward the leaderboard.`,
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isJoined) {
    return (
      <Card className={cn('border-[#0056D2]/20 bg-gradient-to-br from-[#0056D2]/5 to-[#06B6D4]/5', className)}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#0056D2] rounded-full flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                You're in the Sprint!
              </h3>
              <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                Start booking or logging sessions to earn points
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-[#0056D2] hover:bg-[#004BB8] text-white flex-1">
              Book a Session
            </Button>
            <Button size="sm" variant="outline" className="text-[#06B6D4] border-[#06B6D4]/30 hover:bg-[#06B6D4]/10">
              Log Offline
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border-[#0056D2]/15', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
          <Users className="h-5 w-5 text-[#0056D2]" />
          Join Sprint
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Role Selection */}
        <div>
          <Label className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-3 block">
            Participate as:
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant={roles.includes('learner') ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRoleToggle('learner')}
              className={cn(
                'justify-start',
                roles.includes('learner')
                  ? 'bg-[#0056D2] hover:bg-[#004BB8] text-white'
                  : 'text-[#0056D2] border-[#0056D2]/30 hover:bg-[#0056D2]/10'
              )}
            >
              Learner
            </Button>
            <Button
              variant={roles.includes('mentor') ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleRoleToggle('mentor')}
              className={cn(
                'justify-start',
                roles.includes('mentor')
                  ? 'bg-[#0056D2] hover:bg-[#004BB8] text-white'
                  : 'text-[#0056D2] border-[#0056D2]/30 hover:bg-[#0056D2]/10'
              )}
            >
              Mentor
            </Button>
          </div>
        </div>

        {/* Time Windows */}
        <div>
          <Label className="text-sm font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-3 block">
            Preferred time windows:
          </Label>
          <div className="grid grid-cols-1 gap-2">
            {TIME_WINDOWS.map((window) => (
              <Button
                key={window}
                variant={timeWindows.includes(window) ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleTimeWindowToggle(window)}
                className={cn(
                  'justify-start text-xs',
                  timeWindows.includes(window)
                    ? 'bg-[#06B6D4]/20 text-[#06B6D4] hover:bg-[#06B6D4]/30'
                    : 'text-[#64748B] hover:bg-[#0056D2]/5 hover:text-[#0056D2]'
                )}
              >
                <Clock className="h-3 w-3 mr-2" />
                {window}
              </Button>
            ))}
          </div>
        </div>

        {/* Online Only Toggle */}
        <div className="flex items-center space-x-3">
          <Switch
            id="online-only"
            checked={onlineOnly}
            onCheckedChange={setOnlineOnly}
          />
          <Label htmlFor="online-only" className="flex items-center gap-2 text-sm font-medium cursor-pointer">
            <Globe className="h-4 w-4 text-[#06B6D4]" />
            Online sessions only
          </Label>
        </div>

        {/* Join Button */}
        <Button
          onClick={handleJoin}
          disabled={isSubmitting || roles.length === 0}
          className="w-full bg-[#0056D2] hover:bg-[#004BB8] text-white font-semibold"
        >
          {isSubmitting ? 'Joining...' : 'Join Sprint'}
        </Button>

        {/* Quick Info */}
        <div className="text-xs text-[#64748B] dark:text-[#94A3B8] space-y-1">
          <p>• Sessions must be ≥30 minutes to count</p>
          <p>• Both parties must confirm completion</p>
          <p>• Fair play rules apply</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default JoinSprintCard;
