import { TrendingUp, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Skill } from "@/mock/skillswap-data";

interface SkillCardProps {
  skill: Skill;
  variant?: "default" | "featured" | "compact";
  showDemand?: boolean;
  showDifficulty?: boolean;
  className?: string;
  onClick?: () => void;
}

export function SkillCard({
  skill,
  variant = "default",
  showDemand = true,
  showDifficulty = true,
  className,
  onClick
}: SkillCardProps) {
  const difficultyLabels = {
    1: "Beginner",
    2: "Intermediate", 
    3: "Advanced"
  };

  const difficultyColors = {
    1: "bg-brand-green/10 text-brand-green border-brand-green/20",
    2: "bg-brand-amber/10 text-brand-amber border-brand-amber/20",
    3: "bg-brand-red/10 text-brand-red border-brand-red/20"
  };

  if (variant === "compact") {
    return (
      <div 
        className={cn(
          "flex items-center gap-3 p-3 glass rounded-lg hover-lift cursor-pointer",
          className
        )}
        onClick={onClick}
      >
        <div className="text-2xl">{skill.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-foreground truncate">{skill.name}</h3>
          <p className="text-sm text-muted-foreground">{skill.category}</p>
        </div>
        {showDemand && (
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="w-3 h-3 text-brand-secondary" />
            <span className="text-muted-foreground">{skill.demandScore}%</span>
          </div>
        )}
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <Card className={cn(
        "glass-card hover-lift cursor-pointer group overflow-hidden",
        className
      )} onClick={onClick}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-brand/10 group-hover:bg-gradient-brand/20 transition-colors">
              <span className="text-3xl">{skill.icon}</span>
            </div>
            {showDemand && skill.demandScore > 80 && (
              <Badge variant="secondary" className="bg-brand-red/10 text-brand-red border-brand-red/20">
                🔥 Hot
              </Badge>
            )}
          </div>
          
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand-primary transition-colors">
            {skill.name}
          </h3>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {skill.description}
          </p>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" size="sm" className="text-xs">
              {skill.category}
            </Badge>
            {showDemand && (
              <div className="flex items-center gap-1 text-sm">
                <Users className="w-3 h-3 text-brand-secondary" />
                <span className="text-muted-foreground">{skill.demandScore}% demand</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn(
      "glass-card hover-lift cursor-pointer group",
      className
    )} onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-2xl">{skill.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-brand-primary transition-colors truncate">
              {skill.name}
            </h3>
            <p className="text-sm text-muted-foreground">{skill.category}</p>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {skill.description}
        </p>
        
        <div className="flex items-center justify-between">
          {showDifficulty && (
            <Badge 
              variant="outline" 
              size="sm" 
              className={cn("text-xs", difficultyColors[skill.difficulty])}
            >
              {difficultyLabels[skill.difficulty]}
            </Badge>
          )}
          {showDemand && (
            <div className="flex items-center gap-1 text-sm">
              <TrendingUp className="w-3 h-3 text-brand-secondary" />
              <span className="text-muted-foreground">{skill.demandScore}%</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
