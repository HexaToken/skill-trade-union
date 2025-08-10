import { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Shield, CreditCard, Zap, Star, Heart, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { CreditDisplay } from '@/components/CreditDisplay';

interface StickyPanelProps {
  type: 'course' | 'profile' | 'mentor' | 'session';
  title: string;
  className?: string;
  
  // Course/Class specific
  price?: number;
  seatsLeft?: number;
  maxSeats?: number;
  schedule?: Array<{ date: string; startTime: string; endTime: string }>;
  enrolled?: number;
  
  // Profile/Mentor specific
  creditsPerHour?: number;
  rating?: number;
  ratingCount?: number;
  responseTime?: string;
  nextAvailable?: string;
  
  // Common actions
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onInstantHelp?: () => void;
  onAddToWishlist?: () => void;
  onShare?: () => void;
  
  // Labels
  primaryActionLabel?: string;
  secondaryActionLabel?: string;
  
  // States
  isLoading?: boolean;
  isEnrolled?: boolean;
  isInWishlist?: boolean;
  canInstantHelp?: boolean;
  
  // Additional content
  children?: React.ReactNode;
}

export default function StickyPanel({
  type,
  title,
  className,
  price,
  seatsLeft,
  maxSeats,
  schedule,
  enrolled,
  creditsPerHour,
  rating,
  ratingCount,
  responseTime,
  nextAvailable,
  onPrimaryAction,
  onSecondaryAction,
  onInstantHelp,
  onAddToWishlist,
  onShare,
  primaryActionLabel,
  secondaryActionLabel,
  isLoading = false,
  isEnrolled = false,
  isInWishlist = false,
  canInstantHelp = false,
  children
}: StickyPanelProps) {
  const [selectedSchedule, setSelectedSchedule] = useState(0);
  const [enableEscrow, setEnableEscrow] = useState(true);
  const [duration, setDuration] = useState(60);

  const seatsPercentage = seatsLeft && maxSeats ? ((maxSeats - seatsLeft) / maxSeats) * 100 : 0;

  const renderCoursePanel = () => (
    <>
      {/* Price and enrollment info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditDisplay amount={price || 0} size="lg" />
          </div>
          <Badge variant={seatsLeft && seatsLeft <= 3 ? "destructive" : "secondary"}>
            {seatsLeft} seats left
          </Badge>
        </div>

        {seatsLeft && maxSeats && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Enrollment</span>
              <span className="font-medium">{maxSeats - seatsLeft} / {maxSeats}</span>
            </div>
            <Progress value={seatsPercentage} className="h-2" />
          </div>
        )}

        {enrolled && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{enrolled.toLocaleString()} students enrolled</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Schedule selection */}
      {schedule && schedule.length > 0 && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Select Schedule</Label>
          <Select value={selectedSchedule.toString()} onValueChange={(value) => setSelectedSchedule(parseInt(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {schedule.map((slot, index) => (
                <SelectItem key={index} value={index.toString()}>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {new Date(slot.date).toLocaleDateString()}
                    <Clock className="w-4 h-4" />
                    {slot.startTime} - {slot.endTime}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Escrow option */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          <Label htmlFor="escrow" className="text-sm">
            Use escrow protection
          </Label>
        </div>
        <Switch
          id="escrow"
          checked={enableEscrow}
          onCheckedChange={setEnableEscrow}
        />
      </div>

      {enableEscrow && (
        <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-lg">
          💡 Credits held safely until session completion is confirmed by both parties
        </div>
      )}
    </>
  );

  const renderProfilePanel = () => (
    <>
      {/* Pricing and rating */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditDisplay amount={creditsPerHour || 0} size="lg" />
            <span className="text-sm text-muted-foreground">/hour</span>
          </div>
          {rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{rating}</span>
              <span className="text-sm text-muted-foreground">({ratingCount})</span>
            </div>
          )}
        </div>

        {responseTime && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Responds {responseTime}</span>
          </div>
        )}

        {nextAvailable && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Next available: {new Date(nextAvailable).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Session duration */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Session Duration</Label>
        <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="90">1.5 hours</SelectItem>
            <SelectItem value="120">2 hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Total calculation */}
      <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
        <div className="flex justify-between text-sm">
          <span>Duration:</span>
          <span>{duration} minutes</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Rate:</span>
          <span>{creditsPerHour} credits/hour</span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium">
          <span>Total:</span>
          <CreditDisplay amount={Math.round((creditsPerHour || 0) * (duration / 60))} />
        </div>
      </div>

      {/* Escrow option */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          <Label htmlFor="escrow" className="text-sm">
            Use escrow protection
          </Label>
        </div>
        <Switch
          id="escrow"
          checked={enableEscrow}
          onCheckedChange={setEnableEscrow}
        />
      </div>
    </>
  );

  return (
    <Card className={cn('sticky top-20 h-fit', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {type === 'course' && renderCoursePanel()}
        {(type === 'profile' || type === 'mentor') && renderProfilePanel()}
        
        {children}

        <Separator />

        {/* Action buttons */}
        <div className="space-y-3">
          {/* Primary action */}
          <Button
            className="w-full"
            onClick={onPrimaryAction}
            disabled={isLoading || (type === 'course' && seatsLeft === 0)}
            size="lg"
          >
            {isLoading ? (
              'Loading...'
            ) : isEnrolled ? (
              'Continue Learning'
            ) : (
              primaryActionLabel || (type === 'course' ? 'Enroll Now' : 'Book Session')
            )}
          </Button>

          {/* Secondary action */}
          {onSecondaryAction && (
            <Button
              variant="outline"
              className="w-full"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel || 'Add to Path'}
            </Button>
          )}

          {/* Instant help CTA */}
          {canInstantHelp && onInstantHelp && (
            <Button
              variant="secondary"
              className="w-full bg-gradient-to-r from-brand-amber/20 to-brand-green/20 border-brand-amber/50 text-brand-amber hover:from-brand-amber/30 hover:to-brand-green/30"
              onClick={onInstantHelp}
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Instant Call
            </Button>
          )}

          {/* Utility actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onAddToWishlist}
            >
              <Heart className={cn('w-4 h-4 mr-1', isInWishlist && 'fill-red-500 text-red-500')} />
              {isInWishlist ? 'Saved' : 'Save'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={onShare}
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </Button>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="pt-3 space-y-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3 text-green-600" />
            <span>Secure payments with escrow protection</span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="w-3 h-3" />
            <span>Pay with credits or card</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
