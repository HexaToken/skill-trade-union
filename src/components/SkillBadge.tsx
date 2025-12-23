import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { type Skill, type SkillBadgeProps, getSkillCategoryColor } from '@/models/skill-types';

export function SkillBadge({
  skill,
  variant = 'default',
  size = 'md',
  showIcon = true,
  showCategory = false,
  onClick,
  className,
}: SkillBadgeProps) {
  const isClickable = !!onClick;
  const categoryColor = getSkillCategoryColor(skill.category);

  const badgeContent = (
    <div className="flex items-center gap-1.5">
      {showIcon && skill.icon && (
        <img 
          src={skill.icon} 
          alt="" 
          className={cn(
            "flex-shrink-0",
            size === 'sm' && "w-3 h-3",
            size === 'md' && "w-4 h-4", 
            size === 'lg' && "w-5 h-5"
          )}
        />
      )}
      
      <span className={cn(
        "font-medium",
        size === 'sm' && "text-xs",
        size === 'md' && "text-sm",
        size === 'lg' && "text-base"
      )}>
        {skill.name}
      </span>
      
      {showCategory && (
        <span className={cn(
          "text-muted-foreground",
          size === 'sm' && "text-xs",
          size === 'md' && "text-xs",
          size === 'lg' && "text-sm"
        )}>
          ({skill.category})
        </span>
      )}

      {variant === 'new' && (
        <span className={cn(
          "bg-success text-white rounded-full px-1.5 py-0.5 text-xs font-bold",
          size === 'sm' && "text-xs px-1 py-0.5",
          size === 'lg' && "text-sm px-2 py-1"
        )}>
          NEW
        </span>
      )}

      {variant === 'verified' && (
        <span className="text-primary" aria-label="Verified skill">
          ✓
        </span>
      )}

      {variant === 'featured' && skill.isFeatured && (
        <span className="text-warning" aria-label="Featured skill">
          ⭐
        </span>
      )}
    </div>
  );

  const baseClasses = cn(
    "inline-flex items-center transition-all duration-200",
    size === 'sm' && "h-6 px-2",
    size === 'md' && "h-7 px-3",
    size === 'lg' && "h-8 px-4",
    isClickable && "cursor-pointer hover:shadow-md hover:scale-105",
    className
  );

  // Variant-specific styling
  let variantClasses = "";
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";

  switch (variant) {
    case 'featured':
      badgeVariant = "default";
      variantClasses = "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700";
      break;
    case 'verified':
      badgeVariant = "default";
      variantClasses = "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700";
      break;
    case 'new':
      badgeVariant = "default";
      variantClasses = "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700";
      break;
    default:
      badgeVariant = "secondary";
      variantClasses = "hover:bg-muted";
      break;
  }

  if (isClickable) {
    return (
      <button
        onClick={() => onClick(skill)}
        className={cn(baseClasses, variantClasses)}
        style={{
          borderLeftColor: variant === 'default' ? categoryColor : undefined,
          borderLeftWidth: variant === 'default' ? '3px' : undefined,
        }}
      >
        {badgeContent}
      </button>
    );
  }

  return (
    <Badge
      variant={badgeVariant}
      className={cn(baseClasses, variantClasses)}
      style={{
        borderLeftColor: variant === 'default' ? categoryColor : undefined,
        borderLeftWidth: variant === 'default' ? '3px' : undefined,
      }}
    >
      {badgeContent}
    </Badge>
  );
}

// Specialized badge components for common use cases
export function FeaturedSkillBadge({ skill, ...props }: Omit<SkillBadgeProps, 'variant'>) {
  return <SkillBadge skill={skill} variant="featured" {...props} />;
}

export function VerifiedSkillBadge({ skill, ...props }: Omit<SkillBadgeProps, 'variant'>) {
  return <SkillBadge skill={skill} variant="verified" {...props} />;
}

export function NewSkillBadge({ skill, ...props }: Omit<SkillBadgeProps, 'variant'>) {
  return <SkillBadge skill={skill} variant="new" {...props} />;
}

// Skill badge list component for displaying multiple skills
interface SkillBadgeListProps {
  skills: Skill[];
  maxVisible?: number;
  onSkillClick?: (skill: Skill) => void;
  variant?: SkillBadgeProps['variant'];
  size?: SkillBadgeProps['size'];
  className?: string;
}

export function SkillBadgeList({
  skills,
  maxVisible = 5,
  onSkillClick,
  variant = 'default',
  size = 'md',
  className,
}: SkillBadgeListProps) {
  const visibleSkills = skills.slice(0, maxVisible);
  const remainingCount = skills.length - maxVisible;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {visibleSkills.map((skill) => (
        <SkillBadge
          key={skill.id}
          skill={skill}
          variant={variant}
          size={size}
          onClick={onSkillClick}
        />
      ))}
      
      {remainingCount > 0 && (
        <Badge variant="outline" className={cn(
          size === 'sm' && "h-6 px-2 text-xs",
          size === 'md' && "h-7 px-3 text-sm",
          size === 'lg' && "h-8 px-4 text-base"
        )}>
          +{remainingCount} more
        </Badge>
      )}
    </div>
  );
}

// Skill category badge for category filtering
interface SkillCategoryBadgeProps {
  category: string;
  isSelected?: boolean;
  onClick?: (category: string) => void;
  className?: string;
}

export function SkillCategoryBadge({ 
  category, 
  isSelected = false, 
  onClick, 
  className 
}: SkillCategoryBadgeProps) {
  const categoryColor = getSkillCategoryColor(category as any);
  const isClickable = !!onClick;

  return (
    <Badge
      variant={isSelected ? "default" : "outline"}
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-sm",
        isSelected && "shadow-md",
        isClickable && "hover:scale-105",
        className
      )}
      style={{
        backgroundColor: isSelected ? categoryColor : undefined,
        borderColor: categoryColor,
        color: isSelected ? 'white' : categoryColor,
      }}
      onClick={() => onClick?.(category)}
    >
      {category}
    </Badge>
  );
}

export default SkillBadge;
