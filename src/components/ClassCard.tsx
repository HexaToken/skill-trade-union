import { Star, Users, Clock, Calendar, BookOpen, Award, Play, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Course } from '@/models/expert-types';
import { users } from '@/data/mockData';

interface ClassCardProps {
  course: Course;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
  onViewDetails?: (courseId: string) => void;
  onEnroll?: (courseId: string) => void;
  onInstantHelp?: (courseId: string) => void;
  showProgress?: boolean;
  progress?: number;
}

const difficultyLabels = {
  1: { label: 'Beginner', color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800' },
  2: { label: 'Intermediate', color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800' },
  3: { label: 'Advanced', color: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800' }
};

export default function ClassCard({ 
  course, 
  variant = 'default', 
  className, 
  onViewDetails,
  onEnroll,
  onInstantHelp,
  showProgress = false,
  progress = 0
}: ClassCardProps) {
  const teacher = users.find(u => u.id === course.teacherId);
  const difficulty = difficultyLabels[course.level];
  const seatsRemaining = course.maxSeats - course.currentSeats;
  const seatsPercentage = (course.currentSeats / course.maxSeats) * 100;
  
  const totalDuration = course.lessons?.reduce((total, lesson) => total + lesson.durationMins, 0) || 
                       (course.schedule?.length ? course.schedule.length * 120 : 0); // Fallback estimate

  if (variant === 'compact') {
    return (
      <Card className={cn('hover-lift cursor-pointer', className)} onClick={() => onViewDetails?.(course.id)}>
        <div className="flex items-center gap-4 p-4">
          <div className="relative">
            <img 
              src={course.thumbnailUrl} 
              alt={course.title}
              className="w-20 h-14 object-cover rounded-lg"
            />
            {course.badges.includes('recorded') && (
              <Badge size="sm" className="absolute -top-1 -right-1 bg-brand-primary">
                <Play className="w-3 h-3" />
              </Badge>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{course.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{teacher?.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium">{course.ratingAvg}</span>
              </div>
              <span className="text-xs text-muted-foreground">{course.pricePerSeat} credits</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={cn(
        'hover-lift transition-all duration-200 group overflow-hidden',
        variant === 'featured' && 'border-brand-primary/50 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5',
        className
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={course.thumbnailUrl} 
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-1">
          {course.badges.map((badge) => {
            const badgeConfig = {
              group: { icon: Users, label: 'Group Class', color: 'bg-blue-500' },
              materials: { icon: BookOpen, label: 'Materials', color: 'bg-green-500' },
              recorded: { icon: Play, label: 'Recorded', color: 'bg-purple-500' },
              certificate: { icon: Award, label: 'Certificate', color: 'bg-brand-secondary' }
            }[badge];
            
            if (!badgeConfig) return null;
            const Icon = badgeConfig.icon;
            
            return (
              <Badge key={badge} className={cn('text-white border-0', badgeConfig.color)} size="sm">
                <Icon className="w-3 h-3 mr-1" />
                {badgeConfig.label}
              </Badge>
            );
          })}
        </div>

        {/* Duration overlay */}
        <div className="absolute bottom-3 right-3">
          <Badge className="bg-black/70 text-white border-0" size="sm">
            <Clock className="w-3 h-3 mr-1" />
            {Math.round(totalDuration / 60)}h {totalDuration % 60}m
          </Badge>
        </div>

        {variant === 'featured' && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-brand-primary text-white border-0">Featured</Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 
              className="font-semibold text-lg line-clamp-2 cursor-pointer hover:text-brand-primary transition-colors"
              onClick={() => onViewDetails?.(course.id)}
            >
              {course.title}
            </h3>
            <Badge variant="outline" className={difficulty.color} size="sm">
              {difficulty.label}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.subtitle || course.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Teacher info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={teacher?.avatarUrl} alt={teacher?.name} />
            <AvatarFallback className="text-xs">
              {teacher?.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{teacher?.name}</p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">{teacher?.ratingAvg}</span>
              <span className="text-xs text-muted-foreground">({teacher?.ratingCount})</span>
            </div>
          </div>
          <span className="text-sm text-muted-foreground">{course.language}</span>
        </div>

        {/* Rating and enrollment */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-medium">{course.ratingAvg}</span>
              <span className="text-muted-foreground">({course.ratingCount})</span>
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users className="w-3 h-3" />
              <span>{course.enrolled?.toLocaleString() || course.currentSeats} enrolled</span>
            </div>
          </div>
          
          <div className="font-semibold text-brand-primary">
            {course.pricePerSeat} credits
          </div>
        </div>

        {/* Seats progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Available Seats</span>
            <span className="font-medium">
              {seatsRemaining} of {course.maxSeats} remaining
            </span>
          </div>
          <Progress value={seatsPercentage} className="h-2" />
          {seatsRemaining <= 3 && seatsRemaining > 0 && (
            <Badge variant="destructive" size="sm">
              Limited seats!
            </Badge>
          )}
        </div>

        {/* Course progress (if enrolled) */}
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Next session date */}
        {course.schedule?.length ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              Next session: {new Date(course.schedule[0].date).toLocaleDateString()}
            </span>
          </div>
        ) : null}

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(course.id)}
          >
            View Details
          </Button>
          
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onEnroll?.(course.id)}
            disabled={seatsRemaining === 0}
          >
            {seatsRemaining === 0 ? 'Full' : showProgress ? 'Continue' : 'Enroll'}
          </Button>
        </div>

        {/* Instant Help CTA */}
        <Button
          variant="secondary"
          size="sm"
          className="w-full bg-gradient-to-r from-brand-amber/20 to-brand-green/20 border-brand-amber/50 text-brand-amber hover:from-brand-amber/30 hover:to-brand-green/30"
          onClick={() => onInstantHelp?.(course.id)}
        >
          <Zap className="w-4 h-4 mr-2" />
          Get Instant Expert Help
        </Button>
      </CardContent>
    </Card>
  );
}
