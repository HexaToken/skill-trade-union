import React from 'react';
import { Star, MapPin, MessageCircle, Zap, CheckCircle, FlaskConical } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface MatchCardProps {
  // Core user data
  name: string;
  location: string;
  avatarUrl: string;
  rating: number;
  reviews: number;
  
  // Availability & location
  availabilityNote?: string;
  sameCity?: boolean;
  
  // Skill information
  skillTitle: string;
  category: string;
  creditsPerHour: number;
  level: string;
  
  // Description & verification
  blurb: string;
  chips?: Array<{ label: string; tone?: "neutral" | "success" | "warning" }>;
  verifiedID?: boolean;
  skillTested?: boolean;
  matchPercent?: number;
  
  // Actions
  onViewProfile?: () => void;
  onBook?: () => void;
  onInstantCall?: () => void;
  
  // Variants
  variant?: 'default' | 'compact' | 'skeleton';
  showInstant?: boolean;
  className?: string;
}

export default function MatchCard({
  name = "Marcus Chen",
  location = "San Francisco, USA",
  avatarUrl,
  rating = 4.8,
  reviews = 89,
  availabilityNote = "Available in 4d",
  sameCity = true,
  skillTitle = "Logo Design",
  category = "Design",
  creditsPerHour = 15,
  level = "Level 1",
  blurb = "Full-stack developer and guitar enthusiast. Building the future, one line of code at a time.",
  chips = [],
  verifiedID = true,
  skillTested = true,
  matchPercent = 92,
  onViewProfile,
  onBook,
  onInstantCall,
  variant = 'default',
  showInstant = true,
  className
}: MatchCardProps) {
  
  // Skeleton variant
  if (variant === 'skeleton') {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardHeader className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0 space-y-4">
          <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/5"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded flex-1"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded flex-1"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderChips = () => {
    const allChips = [...(chips || [])];
    
    // Add verification chips
    if (verifiedID) {
      allChips.push({ label: "✓ ID Verified", tone: "success" });
    }
    if (skillTested) {
      allChips.push({ label: "🧪 Skill Tested", tone: "neutral" });
    }
    
    return allChips.map((chip, index) => {
      const toneStyles = {
        warning: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700",
        success: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-700",
        neutral: "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600"
      };
      
      return (
        <Badge
          key={index}
          variant="outline"
          size="sm"
          className={cn(
            "text-xs font-medium",
            toneStyles[chip.tone || 'neutral']
          )}
        >
          {chip.label}
        </Badge>
      );
    });
  };

  return (
    <Card 
      className={cn(
        'group cursor-pointer transition-all duration-300',
        variant === 'compact' && 'p-4',
        className
      )}
      role="article"
      aria-label={`Match card for ${name}`}
    >
      <CardHeader className={cn("pb-4", variant === 'compact' && "p-0 pb-3")}>
        {/* Match Percentage Pill */}
        {matchPercent && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-emerald-600 text-white border-0 px-3 py-1 text-xs font-semibold rounded-full">
              {matchPercent}% Match
            </Badge>
          </div>
        )}
        
        {/* Header Row */}
        <div className="flex items-start gap-4 pr-20">
          <Avatar className={cn(
            "ring-2 ring-slate-100 dark:ring-slate-700 transition-all duration-200",
            variant === 'compact' ? "w-12 h-12" : "w-14 h-14"
          )}>
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-lg font-semibold">
              {name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-1">
              <h3 className={cn(
                "font-bold text-[#0F172A] dark:text-[#F1F5F9] font-heading truncate",
                variant === 'compact' ? "text-lg" : "text-xl"
              )}>
                {name}
              </h3>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-[#334155] dark:text-[#E2E8F0] mb-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span className="truncate">{location}</span>
              {sameCity && (
                <Badge size="sm" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700 text-xs">
                  Same city
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{rating}</span>
                <span className="text-slate-500">({reviews})</span>
              </div>
              
              {availabilityNote && (
                <span className="text-[#06B6D4] font-medium">
                  {availabilityNote}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className={cn("space-y-4", variant === 'compact' && "p-0 space-y-3")}>
        {/* Skill Strip */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-100 via-blue-50 to-cyan-100 dark:from-slate-800 dark:via-blue-900/20 dark:to-cyan-900/20 p-4 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h4 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] text-lg mb-1">
                {skillTitle}
              </h4>
              <p className="text-sm text-[#06B6D4] font-medium">
                {creditsPerHour} credits/hour • {category}
              </p>
            </div>
            <Badge className="bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 text-xs font-semibold">
              {level}
            </Badge>
          </div>
        </div>

        {/* Blurb */}
        {variant !== 'compact' && (
          <p className="text-[#334155] dark:text-[#E2E8F0] leading-relaxed">
            {blurb}
          </p>
        )}

        {/* Chips Row */}
        {((chips && chips.length > 0) || verifiedID || skillTested) && (
          <div className="flex flex-wrap gap-2">
            {renderChips()}
          </div>
        )}

        {/* Actions Row */}
        <div className={cn(
          "flex gap-3",
          "sm:flex-row flex-col",
          "md:items-center"
        )}>
          <Button
            variant="outline"
            className="flex-1 border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white transition-all duration-200 font-semibold"
            onClick={onViewProfile}
            aria-label={`View profile of ${name}`}
          >
            View Profile
          </Button>
          
          <Button
            className="flex-1 bg-[#0056D2] hover:bg-[#004BB8] text-white transition-all duration-200 font-semibold"
            onClick={onBook}
            aria-label={`Book session with ${name}`}
          >
            Book
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "hover:bg-slate-100 dark:hover:bg-slate-800 p-2",
              "hidden sm:flex md:inline-flex"
            )}
            onClick={() => {/* Handle message */}}
            aria-label={`Send message to ${name}`}
          >
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>

        {/* Instant Call Bar */}
        {showInstant && (
          <div 
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#0056D2] to-[#06B6D4] p-4 cursor-pointer hover:from-[#004BB8] hover:to-[#0891B2] transition-all duration-300 group/instant"
            onClick={onInstantCall}
            role="button"
            tabIndex={0}
            aria-label="Start instant call for immediate help"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onInstantCall?.();
              }
            }}
          >
            <div className="flex items-center justify-center gap-2 text-white font-semibold">
              <Zap className="w-5 h-5 group-hover/instant:animate-pulse" />
              <span>Need help now? Start Instant Call</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
