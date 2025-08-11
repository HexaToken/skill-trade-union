import { Star, TrendingUp, Users } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Skill } from '@/models/types';

interface SkillCardProps {
  skill: Skill;
  variant?: 'default' | 'compact' | 'featured';
  className?: string;
  onSelect?: (skill: Skill) => void;
  showActions?: boolean;
  selected?: boolean;
}

const difficultyLabels = {
  1: { label: 'Beginner', color: 'bg-brand-green/10 text-brand-green border-brand-green/20' },
  2: { label: 'Intermediate', color: 'bg-brand-amber/10 text-brand-amber border-brand-amber/20' },
  3: { label: 'Advanced', color: 'bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20' }
};

export default function SkillCard({ 
  skill, 
  variant = 'default', 
  className, 
  onSelect,
  showActions = false,
  selected = false
}: SkillCardProps) {
  const difficulty = difficultyLabels[skill.difficulty];
  
  if (variant === 'compact') {
    return (
      <Button
        variant={selected ? 'default' : 'outline'}
        size="sm"
        className={cn(
          'h-auto p-3 justify-start text-left hover-scale',
          selected && 'ring-2 ring-brand-primary ring-offset-2',
          className
        )}
        onClick={() => onSelect?.(skill)}
      >
        <span className="text-lg mr-2">{skill.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{skill.name}</div>
          <div className="text-xs text-muted-foreground truncate">{skill.category}</div>
        </div>
      </Button>
    );
  }

  return (
    <Card 
      className={cn(
        'hover-lift transition-all duration-200 cursor-pointer group',
        selected && 'ring-2 ring-brand-primary ring-offset-2',
        variant === 'featured' && 'border-brand-primary/50 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5',
        className
      )}
      onClick={() => onSelect?.(skill)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              {skill.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{skill.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{skill.category}</p>
            </div>
          </div>
          
          {variant === 'featured' && (
            <Badge variant="secondary" className="bg-brand-primary/10 text-brand-primary border-brand-primary/20">
              Featured
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {skill.description}
        </p>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span className="text-muted-foreground">Demand:</span>
              <span className="font-medium">{skill.demandScore}%</span>
            </div>
            
            <Badge 
              variant="secondary"
              className={difficulty.color}
              size="sm"
            >
              {difficulty.label}
            </Badge>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="font-medium">{skill.baseRateCredits}</span>
            <span>credits/hr</span>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1">
              Learn
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              Teach
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
