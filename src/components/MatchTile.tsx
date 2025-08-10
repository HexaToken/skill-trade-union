import { MapPin, Clock, Star, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { User, Skill } from "@/models/types";

interface MatchTileProps {
  user: User;
  skill: Skill;
  matchScore?: number;
  distance?: string;
  nextAvailable?: string;
  className?: string;
  onMessage?: () => void;
  onBookSession?: () => void;
  onViewProfile?: () => void;
}

export function MatchTile({
  user,
  skill,
  matchScore = 85,
  distance = "2.4 km",
  nextAvailable = "Today, 3:00 PM",
  className,
  onMessage,
  onBookSession,
  onViewProfile
}: MatchTileProps) {
  const skillLevel = user.skillsOffered.find(s => s.skillId === skill.id)?.level || 1;
  
  return (
    <div className={cn(
      "glass-card p-6 hover-lift cursor-pointer group",
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-12 h-12" onClick={onViewProfile}>
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-foreground hover:text-brand-primary transition-colors cursor-pointer" 
                onClick={onViewProfile}>
              {user.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{user.location.city}, {user.location.country}</span>
              <span>•</span>
              <span>{distance}</span>
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">
          {matchScore}% match
        </Badge>
      </div>

      {/* Skill & Level */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{skill.icon}</span>
          <span className="font-medium text-foreground">{skill.name}</span>
          <Badge variant="outline" size="sm">
            Level {skillLevel}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {user.bio}
        </p>
      </div>

      {/* Rating & Stats */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  "w-3 h-3",
                  i < Math.floor(user.ratingAvg) 
                    ? "fill-brand-warning text-brand-warning" 
                    : "text-muted-foreground"
                )}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              {user.ratingAvg.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({user.ratingCount} reviews)
          </span>
        </div>
        {user.verification.idVerified && (
          <Badge variant="secondary" size="sm" className="text-xs">
            ✓ Verified
          </Badge>
        )}
      </div>

      {/* Availability */}
      <div className="flex items-center gap-2 mb-4 text-sm">
        <Clock className="w-4 h-4 text-brand-secondary" />
        <span className="text-muted-foreground">Next available:</span>
        <span className="font-medium text-foreground">{nextAvailable}</span>
      </div>

      {/* Languages */}
      <div className="flex flex-wrap gap-1 mb-6">
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

      {/* Actions */}
      <div className="flex gap-2">
        <Button 
          size="sm" 
          className="flex-1 bg-gradient-brand hover:opacity-90"
          onClick={onBookSession}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Book Session
        </Button>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={onMessage}
        >
          <MessageCircle className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
