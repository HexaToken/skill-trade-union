import { Star, Users, Clock, Calendar, BookOpen, Award, Play, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const teacher = users.find(u => u.id === course.teacherId);
  const difficulty = difficultyLabels[course.level];
  const seatsRemaining = course.maxSeats - course.currentSeats;
  const seatsPercentage = (course.currentSeats / course.maxSeats) * 100;

  // Generate slug from course title
  const courseSlug = course.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(course.id);
    } else {
      navigate(`/classes/${courseSlug}`);
    }
  };
  
  const totalDuration = course.lessons?.reduce((total, lesson) => total + lesson.durationMins, 0) || 
                       (course.schedule?.length ? course.schedule.length * 120 : 0); // Fallback estimate

  if (variant === 'compact') {
    return (
      <Card className={cn('hover-lift cursor-pointer', className)} onClick={handleViewDetails}>
        <div className="flex items-center gap-4 p-4">
          <div className="relative">
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="w-20 h-14 object-cover rounded-xl"
            />
            {course.badges.includes('recorded') && (
              <Badge size="sm" className="absolute -top-1 -right-1 bg-[#0056D2] text-white">
                <Play className="w-3 h-3" />
              </Badge>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate text-[#0F172A] dark:text-[#F1F5F9]">{course.title}</h3>
            <p className="text-sm text-[#334155] dark:text-[#E2E8F0] truncate">{teacher?.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span className="text-xs font-medium text-[#0F172A] dark:text-[#F1F5F9]">{course.ratingAvg}</span>
              </div>
              <span className="text-xs text-[#06B6D4] font-medium">{course.pricePerSeat} credits</span>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'hover-lift transition-all duration-300 group overflow-hidden cursor-pointer',
        variant === 'featured' && 'bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-900/20 dark:to-cyan-900/20',
        className
      )}
      onClick={handleViewDetails}
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
              group: { icon: Users, label: 'Group Class', color: 'bg-[#0056D2]' },
              materials: { icon: BookOpen, label: 'Materials', color: 'bg-emerald-500' },
              recorded: { icon: Play, label: 'Recorded', color: 'bg-purple-500' },
              certificate: { icon: Award, label: 'Certificate', color: 'bg-[#06B6D4]' }
            }[badge];

            if (!badgeConfig) return null;
            const Icon = badgeConfig.icon;

            return (
              <Badge key={badge} className={cn('text-white border-0 shadow-lg', badgeConfig.color)} size="sm">
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
            <Badge className="bg-gradient-to-r from-orange-400 to-amber-400 text-white border-0 shadow-lg">Featured</Badge>
          </div>
        )}
      </div>

      <CardHeader className="pb-3">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3
              className="font-bold text-lg line-clamp-2 cursor-pointer hover:text-[#0056D2] transition-colors text-[#0F172A] dark:text-[#F1F5F9] font-heading"
              onClick={handleViewDetails}
            >
              {course.title}
            </h3>
            <Badge variant="outline" className={difficulty.color} size="sm">
              {difficulty.label}
            </Badge>
          </div>

          <p className="text-sm text-[#334155] dark:text-[#E2E8F0] line-clamp-2 leading-relaxed">
            {course.subtitle || course.description}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Teacher info */}
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8 ring-2 ring-slate-100 dark:ring-slate-700">
            <AvatarImage src={teacher?.avatarUrl} alt={teacher?.name} />
            <AvatarFallback className="text-xs bg-[#0056D2]/10 text-[#0056D2]">
              {teacher?.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-[#0F172A] dark:text-[#F1F5F9]">{teacher?.name}</p>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-[#0F172A] dark:text-[#F1F5F9]">{teacher?.ratingAvg}</span>
              <span className="text-xs text-[#334155] dark:text-[#E2E8F0]">({teacher?.ratingCount})</span>
            </div>
          </div>
          <span className="text-sm text-[#334155] dark:text-[#E2E8F0]">{course.language}</span>
        </div>

        {/* Rating and enrollment */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{course.ratingAvg}</span>
              <span className="text-[#334155] dark:text-[#E2E8F0]">({course.ratingCount})</span>
            </div>

            <div className="flex items-center gap-1 text-[#334155] dark:text-[#E2E8F0]">
              <Users className="w-3 h-3" />
              <span>{(course.enrolled || course.currentSeats || 0).toLocaleString()} enrolled</span>
            </div>
          </div>

          <div className="font-bold text-[#06B6D4]">
            {course.pricePerSeat} credits
          </div>
        </div>

        {/* Seats progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#334155] dark:text-[#E2E8F0]">Available Seats</span>
            <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
              {seatsRemaining} of {course.maxSeats} remaining
            </span>
          </div>
          <Progress value={seatsPercentage} className="h-2" />
          {seatsRemaining <= 3 && seatsRemaining > 0 && (
            <Badge variant="destructive" size="sm" className="bg-red-500 text-white">
              Limited seats!
            </Badge>
          )}
        </div>

        {/* Course progress (if enrolled) */}
        {showProgress && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#334155] dark:text-[#E2E8F0]">Progress</span>
              <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{progress}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Next session date */}
        {course.schedule?.length ? (
          <div className="flex items-center gap-2 text-sm text-[#334155] dark:text-[#E2E8F0]">
            <Calendar className="w-4 h-4 text-[#06B6D4]" />
            <span>
              Next session: {new Date(course.schedule[0].date).toLocaleDateString()}
            </span>
          </div>
        ) : null}

        {/* Action buttons */}
        <div className="flex gap-3 pt-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white transition-all duration-200 font-semibold"
            onClick={handleViewDetails}
          >
            View Details
          </Button>

          <Button
            size="sm"
            className="flex-1 bg-[#0056D2] hover:bg-[#004BB8] text-white font-semibold transition-all duration-200"
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
