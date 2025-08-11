import { Star, MapPin, Clock, MessageCircle, Video, Calendar, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { MatchResult } from '@/models/expert-types';
import { skills } from '@/data/mockData';

interface MatchCardProps {
  match: MatchResult;
  className?: string;
  onViewProfile?: (userId: string) => void;
  onBook?: (userId: string, skillId: string) => void;
  onMessage?: (userId: string) => void;
  onInstantHelp?: (userId: string, skillId: string) => void;
}

export default function MatchCard({ 
  match, 
  className, 
  onViewProfile,
  onBook,
  onMessage,
  onInstantHelp
}: MatchCardProps) {
  const { user, skill, matchScore, reasons, distance, nextAvailable } = match;
  
  // Check if user has instant availability (mock check)
  const hasInstantAvailable = user.id === 'user-1' || user.id === 'user-2';
  
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-brand-success bg-brand-success/10 border-brand-success/20';
    if (score >= 80) return 'text-brand-secondary bg-brand-secondary/10 border-brand-secondary/20';
    return 'text-brand-primary bg-brand-primary/10 border-brand-primary/20';
  };

  const formatDistance = (distanceKm?: number) => {
    if (!distanceKm) return 'Same city';
    if (distanceKm < 1) return `${Math.round(distanceKm * 1000)}m away`;
    if (distanceKm < 100) return `${Math.round(distanceKm)}km away`;
    return `${Math.round(distanceKm / 100) * 100}km+ away`;
  };

  const formatNextAvailable = (dateStr?: string) => {
    if (!dateStr) return 'Available now';
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) return `Available in ${diffHours}h`;
    if (diffHours < 168) return `Available in ${Math.ceil(diffHours / 24)}d`;
    return date.toLocaleDateString();
  };

  return (
    <Card className={cn('hover-lift transition-all duration-200 group', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border-2 border-muted">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-lg">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">{user.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {user.location.city}, {user.location.country}
                </p>
              </div>
              
              <Badge 
                variant="outline" 
                className={cn('border font-medium', getMatchScoreColor(matchScore))}
              >
                {matchScore}% Match
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{user.ratingAvg}</span>
                <span className="text-muted-foreground">({user.ratingCount})</span>
              </div>
              
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-3 h-3" />
                {formatNextAvailable(nextAvailable)}
              </div>
              
              <div className="text-muted-foreground">
                {formatDistance(distance)}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Primary Skill */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <span className="text-2xl">{skill.icon}</span>
          <div className="flex-1">
            <h4 className="font-medium">{skill.name}</h4>
            <p className="text-sm text-muted-foreground">
              {skill.baseRateCredits} credits/hour • {skill.category}
            </p>
          </div>
          <Badge variant="secondary">
            Level {user.skillsOffered.find(s => s.skillId === skill.id)?.level || 1}
          </Badge>
        </div>

        {/* Bio */}
        <p className="text-sm text-muted-foreground line-clamp-2">
          {user.bio}
        </p>

        {/* Match Reasons */}
        <div className="flex flex-wrap gap-1">
          {reasons.map((reason, index) => (
            <Badge key={index} variant="outline" size="sm">
              {reason}
            </Badge>
          ))}
        </div>

        {/* Verification Badges */}
        {user.verification.idVerified && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              ✓ ID Verified
            </Badge>
            {user.verification.testsPassed.length > 0 && (
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                ✓ Skill Tested
              </Badge>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewProfile?.(user.id)}
          >
            View Profile
          </Button>
          
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onBook?.(user.id, skill.id)}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Book
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMessage?.(user.id)}
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>

        {/* Instant Help CTA - ExpertMatch AI */}
        {hasInstantAvailable && (
          <Button
            variant="secondary"
            size="sm"
            className="w-full bg-gradient-to-r from-brand-amber/20 to-brand-green/20 border-brand-amber/50 text-brand-amber hover:from-brand-amber/30 hover:to-brand-green/30"
            onClick={() => onInstantHelp?.(user.id, skill.id)}
          >
            <Zap className="w-4 h-4 mr-2" />
            Need help now? Start Instant Call
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
