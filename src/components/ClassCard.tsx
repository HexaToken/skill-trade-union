import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  Star, 
  Bookmark,
  Play,
  Award
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import type { Class, User, Skill } from '@/models/types';
import { RatingDisplay } from './RatingDisplay';

interface ClassCardProps {
  classData: Class;
  teacher: User;
  skill: Skill;
  variant?: 'default' | 'compact' | 'featured';
  showActions?: boolean;
  className?: string;
}

export function ClassCard({ 
  classData, 
  teacher, 
  skill, 
  variant = 'default', 
  showActions = true, 
  className 
}: ClassCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const enrollmentPercentage = (classData.currentSeats / classData.maxSeats) * 100;
  const spotsLeft = classData.maxSeats - classData.currentSeats;
  
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return new Date(`2024-01-01T${timeStr}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'status-pending';
      case 'active': return 'status-active';
      case 'completed': return 'status-inactive';
      default: return 'status-inactive';
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'difficulty-1';
      case 2: return 'difficulty-2';
      case 3: return 'difficulty-3';
      default: return 'difficulty-1';
    }
  };

  if (variant === 'compact') {
    return (
      <Card className={cn('glass-card hover-lift cursor-pointer group', className)}>
        <CardContent className="p-4">
          <div className="flex gap-3">
            {/* Class thumbnail placeholder */}
            <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center">
              <span className="text-2xl">{skill.icon}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-brand-primary transition-colors">
                {classData.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="w-6 h-6">
                  <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                  <AvatarFallback className="text-xs">
                    {teacher.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{teacher.name}</span>
              </div>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{classData.currentSeats}/{classData.maxSeats}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(classData.schedule[0]?.date)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-bold text-brand-primary">
                {classData.pricePerSeat} credits
              </div>
              <Badge variant="outline" size="sm" className={getStatusColor(classData.status)}>
                {classData.status}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className={cn('glass-card hover-lift cursor-pointer group relative overflow-hidden', className)}>
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 group-hover:from-brand-primary/10 group-hover:to-brand-secondary/10 transition-colors" />
        
        <CardContent className="p-6 relative">
          {/* Header with thumbnail and bookmark */}
          <div className="flex justify-between items-start mb-4">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center relative group-hover:scale-105 transition-transform">
              <span className="text-4xl">{skill.icon}</span>
              <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Play className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <button 
              onClick={() => setIsBookmarked(!isBookmarked)}
              className="p-2 rounded-lg hover:bg-background/50 transition-colors"
            >
              <Bookmark 
                className={cn(
                  'w-5 h-5',
                  isBookmarked 
                    ? 'fill-brand-primary text-brand-primary' 
                    : 'text-muted-foreground'
                )}
              />
            </button>
          </div>
          
          <h3 className="text-lg font-heading font-bold mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
            {classData.title}
          </h3>
          
          {/* Teacher info */}
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
              <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            
            <div>
              <p className="text-sm font-medium">{teacher.name}</p>
              <RatingDisplay 
                rating={teacher.ratingAvg} 
                size="sm" 
                showNumber={false}
              />
            </div>
          </div>
          
          {/* Class details */}
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-secondary" />
              <span>{formatDate(classData.schedule[0]?.date)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-secondary" />
              <span>{formatTime(classData.schedule[0]?.startTime)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-brand-secondary" />
              <span>{classData.currentSeats}/{classData.maxSeats} enrolled</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-secondary" />
              <Badge variant="outline" className={getDifficultyColor(classData.difficulty)}>
                Level {classData.difficulty}
              </Badge>
            </div>
          </div>
          
          {/* Enrollment progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Enrollment</span>
              <span className="text-foreground">{spotsLeft} spots left</span>
            </div>
            <Progress 
              value={enrollmentPercentage} 
              className="h-2"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xl font-bold text-brand-primary">
              {classData.pricePerSeat} credits
            </div>
            
            {showActions && (
              <Button className="btn-neo">
                Enroll Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('glass-card hover-lift cursor-pointer group', className)}>
      <CardHeader className="pb-4">
        <div className="flex gap-4">
          {/* Class thumbnail */}
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center relative group-hover:scale-105 transition-transform">
            <span className="text-4xl">{skill.icon}</span>
            <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Play className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-heading font-bold line-clamp-2 group-hover:text-brand-primary transition-colors">
                {classData.title}
              </h3>
              
              <button 
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-2 rounded-lg hover:bg-background/50 transition-colors"
              >
                <Bookmark 
                  className={cn(
                    'w-5 h-5',
                    isBookmarked 
                      ? 'fill-brand-primary text-brand-primary' 
                      : 'text-muted-foreground'
                  )}
                />
              </button>
            </div>
            
            {/* Teacher */}
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src={teacher.avatarUrl} alt={teacher.name} />
                <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              
              <div>
                <p className="text-sm font-medium">{teacher.name}</p>
                <RatingDisplay 
                  rating={teacher.ratingAvg} 
                  reviewCount={teacher.ratingCount}
                  size="sm"
                />
              </div>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {classData.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
              <Badge variant="outline" className={getDifficultyColor(classData.difficulty)}>
                Level {classData.difficulty}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {classData.description}
        </p>
        
        {/* Schedule */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-secondary" />
            <div>
              <p className="font-medium">{formatDate(classData.schedule[0]?.date)}</p>
              <p className="text-xs text-muted-foreground">
                {formatTime(classData.schedule[0]?.startTime)} - {formatTime(classData.schedule[0]?.endTime)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-secondary" />
            <div>
              <p className="font-medium">Virtual</p>
              <p className="text-xs text-muted-foreground">Zoom link provided</p>
            </div>
          </div>
        </div>
        
        {/* Enrollment status */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Enrollment</span>
            <span className="text-foreground">
              {classData.currentSeats}/{classData.maxSeats} enrolled
            </span>
          </div>
          <Progress 
            value={enrollmentPercentage} 
            className="h-2 mb-2"
          />
          <p className="text-xs text-muted-foreground">
            {spotsLeft > 0 ? `${spotsLeft} spots remaining` : 'Class is full'}
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-brand-primary">
              {classData.pricePerSeat}
            </div>
            <div className="text-xs text-muted-foreground">credits per seat</div>
          </div>
          
          {showActions && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/classes/${classData.id}`}>
                  View Details
                </Link>
              </Button>
              
              <Button 
                className="btn-neo"
                disabled={spotsLeft === 0}
              >
                {spotsLeft === 0 ? 'Full' : 'Enroll Now'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
