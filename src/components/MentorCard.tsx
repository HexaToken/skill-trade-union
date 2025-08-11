import { Star, MapPin, Clock, MessageCircle, Calendar, Zap, Award, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { CreditDisplay } from '@/components/CreditDisplay';
import type { User } from '@/models/types';
import { skills } from '@/data/mockData';

interface MentorCardProps {
  mentor: User;
  tier?: 'Silver' | 'Gold' | 'Platinum';
  creditsPerHour?: number;
  instantAvailable?: boolean;
  className?: string;
  onViewProfile?: (mentorId: string) => void;
  onRequestMentorship?: (mentorId: string) => void;
  onMessage?: (mentorId: string) => void;
  onInstantCall?: (mentorId: string) => void;
}

const tierConfig = {
  Silver: { color: 'bg-gray-100 text-gray-800 border-gray-300', icon: '🥈' },
  Gold: { color: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: '🥇' },
  Platinum: { color: 'bg-purple-100 text-purple-800 border-purple-300', icon: '💎' }
};

export default function MentorCard({
  mentor,
  tier = 'Silver',
  creditsPerHour = 25,
  instantAvailable = false,
  className,
  onViewProfile,
  onRequestMentorship,
  onMessage,
  onInstantCall
}: MentorCardProps) {
  const tierInfo = tierConfig[tier];
  
  const formatNextAvailable = (lastActive: string) => {
    const diff = Date.now() - new Date(lastActive).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Active now';
    if (hours < 24) return `Active ${hours}h ago`;
    return `Active ${Math.floor(hours / 24)}d ago`;
  };

  const formatResponseTime = () => {
    // Mock response time based on tier
    const times = {
      Silver: '< 24 hours',
      Gold: '< 4 hours', 
      Platinum: '< 1 hour'
    };
    return times[tier];
  };

  return (
    <Card className={cn('hover-lift transition-all duration-200 group', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="w-16 h-16 border-2 border-muted">
              <AvatarImage src={mentor.avatarUrl} alt={mentor.name} />
              <AvatarFallback className="text-lg">
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            {/* Online indicator */}
            <div className={cn(
              'absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-xs',
              instantAvailable ? 'bg-green-500' : 'bg-gray-400'
            )}>
              {instantAvailable && <div className="w-2 h-2 bg-white rounded-full" />}
            </div>

            {/* Tier badge */}
            <div className="absolute -top-2 -left-2">
              <Badge className={cn('text-xs px-2 py-1', tierInfo.color)} variant="outline">
                <span className="mr-1">{tierInfo.icon}</span>
                {tier}
              </Badge>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate group-hover:text-brand-primary transition-colors">
                  {mentor.name}
                </h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {mentor.location.city}, {mentor.location.country}
                </p>
                <p className="text-sm text-muted-foreground">
                  {mentor.timezone.replace('_', ' ').replace('/', ' / ')}
                </p>
              </div>
              
              <div className="text-right">
                <CreditDisplay amount={creditsPerHour} size="lg" />
                <p className="text-xs text-muted-foreground">/hour</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-medium">{mentor.ratingAvg}</span>
                <span className="text-muted-foreground">({mentor.ratingCount})</span>
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Responds {formatResponseTime()}</span>
              </div>
              
              <div className="text-muted-foreground">
                {formatNextAvailable(mentor.lastActive)}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {mentor.bio}
        </p>

        {/* Skills */}
        <div className="space-y-2">
          <p className="text-sm font-medium">Specializations:</p>
          <div className="flex flex-wrap gap-1">
            {mentor.skillsOffered.slice(0, 3).map((skill) => {
              const skillData = skills.find(s => s.id === skill.skillId);
              return skillData ? (
                <Badge key={skill.skillId} variant="secondary" size="sm">
                  <span className="mr-1">{skillData.icon}</span>
                  {skillData.name}
                  <Badge className="ml-1 h-4 w-4 p-0 text-xs bg-brand-primary text-white">
                    {skill.level}
                  </Badge>
                </Badge>
              ) : null;
            })}
            {mentor.skillsOffered.length > 3 && (
              <Badge variant="outline" size="sm">
                +{mentor.skillsOffered.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        {/* Verification & Stats */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            {mentor.verification.idVerified && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span>ID Verified</span>
              </div>
            )}
            
            {mentor.verification.testsPassed.length > 0 && (
              <div className="flex items-center gap-1 text-blue-600">
                <Award className="w-3 h-3" />
                <span>Skill Tested</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>500+ mentees</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewProfile?.(mentor.id)}
            >
              View Profile
            </Button>
            
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onRequestMentorship?.(mentor.id)}
            >
              <Calendar className="w-4 h-4 mr-1" />
              Request Mentorship
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMessage?.(mentor.id)}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Message
            </Button>

            {instantAvailable && (
              <Button
                variant="secondary"
                size="sm"
                className="bg-gradient-to-r from-brand-amber/20 to-brand-green/20 border-brand-amber/50 text-brand-amber hover:from-brand-amber/30 hover:to-brand-green/30"
                onClick={() => onInstantCall?.(mentor.id)}
              >
                <Zap className="w-4 h-4 mr-1" />
                Call Now
              </Button>
            )}
          </div>
        </div>

        {/* Tier features */}
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">{tier} Tier includes:</p>
          <ul className="space-y-0.5">
            <li>• 1:1 mentorship sessions</li>
            {tier === 'Gold' || tier === 'Platinum' ? <li>• Priority response time</li> : null}
            {tier === 'Platinum' ? <li>• Career guidance & networking</li> : null}
            {tier === 'Platinum' ? <li>• Industry connections</li> : null}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
