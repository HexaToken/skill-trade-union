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
  1: { label: 'Beginner', color: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700' },
  2: { label: 'Intermediate', color: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700' },
  3: { label: 'Advanced', color: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700' }
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
          'h-auto p-3 justify-start text-left',
          selected && 'ring-2 ring-primary ring-offset-2',
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
        'cursor-pointer group',
        selected && 'ring-2 ring-primary ring-offset-2',
        variant === 'featured' && 'bg-primary/5 border-primary/20',
        className
      )}
      onClick={() => onSelect?.(skill)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200">
              {skill.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate text-foreground">{skill.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{skill.category}</p>
            </div>
          </div>

          {variant === 'featured' && (
            <Badge variant="secondary" className="bg-gradient-to-r from-warning/20 to-warning/25 text-warning border-warning/20 font-semibold shadow-sm">
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
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Demand:</span>
              <span className="font-bold text-primary">{skill.demandScore}%</span>
            </div>

            <Badge
              variant="outline"
              className={difficulty.color}
              size="sm"
            >
              {difficulty.label}
            </Badge>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <span className="font-bold text-primary">{skill.baseRateCredits}</span>
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
