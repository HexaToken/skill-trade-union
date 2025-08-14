import React from 'react';
import { 
  GraduationCap, 
  Target, 
  Users, 
  Handshake, 
  CheckCircle, 
  Gift,
  Crown,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EarnOption {
  id: string;
  title: string;
  description: string;
  baseCredits: number;
  icon: React.ReactNode;
  multiplier?: number;
  badge?: string;
  action: () => void;
  disabled?: boolean;
}

interface EarnCreditsPanelProps {
  className?: string;
  onTeachSession?: () => void;
  onJoinSprint?: () => void;
  onReferFriend?: () => void;
  onConfirmTrade?: () => void;
  onCompleteTest?: () => void;
  onDonate?: () => void;
  sprintMultiplier?: number;
  hasActiveMultiplier?: boolean;
}

export default function EarnCreditsPanel({
  className,
  onTeachSession,
  onJoinSprint,
  onReferFriend,
  onConfirmTrade,
  onCompleteTest,
  onDonate,
  sprintMultiplier = 1.0,
  hasActiveMultiplier = false
}: EarnCreditsPanelProps) {
  
  const earnOptions: EarnOption[] = [
    {
      id: 'teach',
      title: 'Teach a Session',
      description: 'Earn credits by sharing your expertise in 1:1 or group sessions',
      baseCredits: 10,
      icon: <GraduationCap className="w-5 h-5" />,
      multiplier: hasActiveMultiplier ? sprintMultiplier : undefined,
      badge: hasActiveMultiplier ? `+${Math.round((sprintMultiplier - 1) * 100)}% Sprint Bonus` : undefined,
      action: onTeachSession || (() => {}),
    },
    {
      id: 'sprint',
      title: 'Join Skill Sprint',
      description: 'Participate in community challenges and climb leaderboards',
      baseCredits: 10,
      icon: <Target className="w-5 h-5" />,
      badge: 'Bonus for top spots',
      action: onJoinSprint || (() => {}),
    },
    {
      id: 'refer',
      title: 'Refer a Friend',
      description: 'Invite someone to SkillSwap and earn when they complete their first session',
      baseCredits: 25,
      icon: <Users className="w-5 h-5" />,
      action: onReferFriend || (() => {}),
    },
    {
      id: 'trade',
      title: 'Confirm Offline Trade',
      description: 'Complete skill trades happening outside the platform',
      baseCredits: 0,
      icon: <Handshake className="w-5 h-5" />,
      badge: 'Variable amount',
      action: onConfirmTrade || (() => {}),
    },
    {
      id: 'test',
      title: 'Complete Skill Test',
      description: 'Verify your expertise with skill assessments',
      baseCredits: 5,
      icon: <CheckCircle className="w-5 h-5" />,
      badge: 'Once per skill',
      action: onCompleteTest || (() => {}),
    },
    {
      id: 'donate',
      title: 'Donation Rewards',
      description: 'Earn bonus credits for charitable contributions',
      baseCredits: 2,
      icon: <Gift className="w-5 h-5" />,
      badge: 'Per dollar donated',
      action: onDonate || (() => {}),
    }
  ];

  const getCreditsDisplay = (option: EarnOption) => {
    if (option.baseCredits === 0) {
      return 'Variable';
    }
    
    const baseAmount = option.baseCredits;
    const finalAmount = option.multiplier ? Math.round(baseAmount * option.multiplier) : baseAmount;
    
    if (option.multiplier && option.multiplier > 1) {
      return (
        <div className="flex items-center gap-1">
          <span className="line-through text-muted-foreground text-sm">+{baseAmount}</span>
          <span className="text-emerald-600 font-semibold">+{finalAmount}</span>
        </div>
      );
    }
    
    return <span className="text-emerald-600 font-semibold">+{baseAmount}</span>;
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-brand-primary" />
          Earn Credits
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {hasActiveMultiplier && (
          <div className="p-3 bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 rounded-lg border border-brand-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-4 h-4 text-brand-primary" />
              <span className="font-semibold text-sm">Sprint Multiplier Active</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Earn {Math.round((sprintMultiplier - 1) * 100)}% more credits from teaching sessions!
            </p>
          </div>
        )}
        
        <div className="grid gap-3">
          {earnOptions.map((option) => (
            <div
              key={option.id}
              className={cn(
                "p-4 rounded-lg border border-border hover:border-brand-primary/50 transition-all cursor-pointer group",
                "hover:shadow-md",
                option.disabled && "opacity-50 cursor-not-allowed"
              )}
              onClick={option.disabled ? undefined : option.action}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-brand-primary group-hover:text-brand-secondary transition-colors">
                    {option.icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{option.title}</h4>
                      {option.badge && (
                        <Badge variant="secondary" size="sm">
                          {option.badge}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  {getCreditsDisplay(option)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Credits are earned automatically when activities are completed
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
