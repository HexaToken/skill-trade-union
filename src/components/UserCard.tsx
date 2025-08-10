import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  MapPin, 
  Clock, 
  MessageCircle, 
  UserCheck,
  Calendar,
  Shield,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { User, Skill } from '@/models/types';
import { skills } from '@/data/mockData';

interface UserCardProps {
  user: User;
  variant?: 'default' | 'compact' | 'match';
  showActions?: boolean;
  matchScore?: number;
  className?: string;
}

export function UserCard({ 
  user, 
  variant = 'default', 
  showActions = true, 
  matchScore,
  className 
}: UserCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getUserSkills = (skillIds: string[]) => {
    return skillIds.map(id => skills.find(s => s.id === id)).filter(Boolean) as Skill[];
  };

  const offeredSkills = getUserSkills(user.skillsOffered.map(s => s.skillId));
  const wantedSkills = getUserSkills(user.skillsWanted.map(s => s.skillId));

  const formatLastActive = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Active now';
    if (diffHours < 24) return `Active ${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Active ${diffDays}d ago`;
    return `Active ${Math.floor(diffDays / 7)}w ago`;
  };

  if (variant === 'compact') {
    return (
      <Card className={cn('glass-card hover-lift transition-all duration-200', className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-sm truncate">{user.name}</h3>
                {user.verification.idVerified && (
                  <Shield className="w-3 h-3 text-brand-primary" />
                )}
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                <Star className="w-3 h-3 fill-brand-warning text-brand-warning" />
                <span>{user.ratingAvg}</span>
                <span>•</span>
                <span>{user.ratingCount} sessions</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{user.location.city}, {user.location.country}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              {showActions && (
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <MessageCircle className="w-3 h-3 mr-1" />
                  Message
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        'glass-card hover-lift transition-all duration-300 group',
        isHovered && 'shadow-glow',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <div className="relative">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback className="text-lg font-semibold">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            {/* Online status indicator */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-background border-2 border-background flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-brand-green animate-pulse" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-heading font-semibold text-lg text-foreground group-hover:text-brand-primary transition-colors">
                    {user.name}
                  </h3>
                  
                  {/* Verification badges */}
                  <div className="flex items-center gap-1">
                    {user.verification.idVerified && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Shield className="w-4 h-4 text-brand-primary" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>ID Verified</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                    
                    {user.badges.includes('top-mentor') && (
                      <Tooltip>
                        <TooltipTrigger>
                          <Award className="w-4 h-4 text-brand-amber" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Top Mentor</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
                
                {/* Rating and stats */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-brand-warning text-brand-warning" />
                    <span className="font-medium">{user.ratingAvg}</span>
                    <span>({user.ratingCount})</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{user.location.city}, {user.location.country}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{formatLastActive(user.lastActive)}</span>
                  </div>
                </div>
                
                {/* Languages */}
                <div className="flex flex-wrap gap-1 mb-3">
                  {user.languages.slice(0, 3).map((lang) => (
                    <Badge key={lang} variant="outline" size="sm" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                  {user.languages.length > 3 && (
                    <Badge variant="outline" size="sm" className="text-xs">
                      +{user.languages.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Match score for match variant */}
              {variant === 'match' && matchScore && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-primary">{matchScore}%</div>
                  <div className="text-xs text-muted-foreground">Match</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Bio */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {user.bio}
        </p>
        
        {/* Skills offered */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Teaching</h4>
          <div className="flex flex-wrap gap-2">
            {offeredSkills.slice(0, 3).map((skill) => {
              const userSkill = user.skillsOffered.find(s => s.skillId === skill.id);
              return (
                <Badge 
                  key={skill.id} 
                  variant="secondary" 
                  className="bg-brand-primary/10 text-brand-primary border-brand-primary/20"
                >
                  {skill.icon} {skill.name}
                  <span className="ml-1 text-xs">L{userSkill?.level}</span>
                </Badge>
              );
            })}
            {offeredSkills.length > 3 && (
              <Badge variant="outline" size="sm">
                +{offeredSkills.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        
        {/* Skills wanted */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Learning</h4>
          <div className="flex flex-wrap gap-2">
            {wantedSkills.slice(0, 3).map((skill) => (
              <Badge 
                key={skill.id} 
                variant="outline" 
                size="sm"
                className="text-muted-foreground"
              >
                {skill.icon} {skill.name}
              </Badge>
            ))}
            {wantedSkills.length > 3 && (
              <Badge variant="outline" size="sm">
                +{wantedSkills.length - 3} more
              </Badge>
            )}
          </div>
        </div>
        
        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button asChild className="flex-1">
              <Link to={`/profile/${user.id}`}>
                <UserCheck className="w-4 h-4 mr-2" />
                View Profile
              </Link>
            </Button>
            
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Book
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
