import { Link } from 'react-router-dom';
import { TrendingUp, Users, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Skill } from '@/models/types';

interface SkillCardProps {
  skill: Skill;
  variant?: 'default' | 'compact' | 'featured';
  showActions?: boolean;
  teacherCount?: number;
  avgRate?: number;
  className?: string;
}

export function SkillCard({ 
  skill, 
  variant = 'default', 
  showActions = true,
  teacherCount = 0,
  avgRate,
  className 
}: SkillCardProps) {

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'difficulty-1';
      case 2: return 'difficulty-2';
      case 3: return 'difficulty-3';
      default: return 'difficulty-1';
    }
  };

  const getDemandColor = (score: number) => {
    if (score >= 90) return 'demand-very-high';
    if (score >= 70) return 'demand-high';
    if (score >= 50) return 'demand-medium';
    return 'demand-low';
  };

  const getDemandLabel = (score: number) => {
    if (score >= 90) return '🔥 Very High';
    if (score >= 70) return '📈 High';
    if (score >= 50) return '📊 Medium';
    return '📉 Low';
  };

  if (variant === 'compact') {
    return (
      <Card className={cn('glass-card hover-lift cursor-pointer group', className)}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 group-hover:from-brand-primary/20 group-hover:to-brand-secondary/20 transition-colors">
              <span className="text-2xl">{skill.icon}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1 group-hover:text-brand-primary transition-colors">
                {skill.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" size="sm" className={getDifficultyColor(skill.difficulty)}>
                  Level {skill.difficulty}
                </Badge>
                <span>•</span>
                <span>{skill.demandScore}% demand</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-sm font-medium">
                {avgRate ? `${avgRate} credits/hr` : `${skill.baseRateCredits} credits/hr`}
              </div>
              {teacherCount > 0 && (
                <div className="text-xs text-muted-foreground">
                  {teacherCount} teachers
                </div>
              )}
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
          <div className="flex items-start justify-between mb-4">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 group-hover:from-brand-primary/20 group-hover:to-brand-secondary/20 transition-colors">
              <span className="text-4xl">{skill.icon}</span>
            </div>
            
            {skill.demandScore > 85 && (
              <Badge className="bg-brand-red/10 text-brand-red border-brand-red/20">
                🔥 Hot
              </Badge>
            )}
          </div>
          
          <h3 className="text-xl font-heading font-bold mb-2 group-hover:text-brand-primary transition-colors">
            {skill.name}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {skill.description}
          </p>
          
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className={getDifficultyColor(skill.difficulty)}>
              Level {skill.difficulty}
            </Badge>
            
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-brand-secondary" />
              <span className="font-medium">{skill.demandScore}%</span>
              <span className="text-muted-foreground">demand</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{teacherCount || 42} teachers</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{avgRate || skill.baseRateCredits} credits/hr</span>
            </div>
          </div>
          
          {showActions && (
            <Button className="w-full btn-neo" asChild>
              <Link to={`/matches?skill=${skill.id}`}>
                Find Teachers
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('glass-card hover-lift cursor-pointer group', className)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 group-hover:from-brand-primary/20 group-hover:to-brand-secondary/20 transition-colors">
              <span className="text-3xl">{skill.icon}</span>
            </div>
            
            <div>
              <CardTitle className="text-lg group-hover:text-brand-primary transition-colors">
                {skill.name}
              </CardTitle>
              <Badge variant="outline" size="sm" className="mt-1">
                {skill.category}
              </Badge>
            </div>
          </div>
          
          <div className="text-right">
            <Badge className={getDemandColor(skill.demandScore)}>
              {getDemandLabel(skill.demandScore)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {skill.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{teacherCount || 42} teachers</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{avgRate || skill.baseRateCredits} credits/hr</span>
            </div>
          </div>
          
          <Badge variant="outline" className={getDifficultyColor(skill.difficulty)}>
            Level {skill.difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-4 h-4 text-brand-secondary" />
            <span className="text-muted-foreground">
              {skill.demandScore}% demand
            </span>
          </div>
        </div>
        
        {showActions && (
          <div className="flex gap-2">
            <Button className="flex-1" asChild>
              <Link to={`/matches?skill=${skill.id}`}>
                Find Teachers
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link to={`/classes?skill=${skill.id}`}>
                Browse Classes
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
