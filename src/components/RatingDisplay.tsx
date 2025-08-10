import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RatingDisplayProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
  reviewCount?: number;
  className?: string;
  readonly?: boolean;
  onChange?: (rating: number) => void;
}

export function RatingDisplay({
  rating,
  maxRating = 5,
  size = 'md',
  showNumber = true,
  reviewCount,
  className,
  readonly = true,
  onChange
}: RatingDisplayProps) {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const handleStarClick = (newRating: number) => {
    if (!readonly && onChange) {
      onChange(newRating);
    }
  };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= rating;
          const isPartial = !isFilled && starRating - 0.5 <= rating;
          
          return (
            <button
              key={index}
              type="button"
              disabled={readonly}
              onClick={() => handleStarClick(starRating)}
              className={cn(
                'relative',
                !readonly && 'hover:scale-110 transition-transform duration-100 cursor-pointer',
                readonly && 'cursor-default'
              )}
            >
              <Star 
                className={cn(
                  sizeClasses[size],
                  isFilled 
                    ? 'fill-brand-warning text-brand-warning' 
                    : isPartial
                    ? 'fill-brand-warning/50 text-brand-warning/50'
                    : 'text-muted-foreground/30'
                )}
              />
              
              {/* Partial fill for decimal ratings */}
              {isPartial && (
                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${((rating - index) * 100)}%` }}
                >
                  <Star 
                    className={cn(
                      sizeClasses[size],
                      'fill-brand-warning text-brand-warning'
                    )}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Rating number and count */}
      {showNumber && (
        <div className={cn('flex items-center gap-1', textSizeClasses[size])}>
          <span className="font-medium text-foreground">
            {rating.toFixed(1)}
          </span>
          
          {reviewCount !== undefined && (
            <>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {reviewCount.toLocaleString()} {reviewCount === 1 ? 'review' : 'reviews'}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface RatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  maxRating?: number;
  className?: string;
}

export function RatingInput({
  rating,
  onRatingChange,
  size = 'md',
  maxRating = 5,
  className
}: RatingInputProps) {
  return (
    <RatingDisplay
      rating={rating}
      maxRating={maxRating}
      size={size}
      showNumber={false}
      readonly={false}
      onChange={onRatingChange}
      className={className}
    />
  );
}

interface RatingStatsProps {
  ratings: Array<{ rating: number; count: number }>;
  totalReviews: number;
  averageRating: number;
  className?: string;
}

export function RatingStats({ 
  ratings, 
  totalReviews, 
  averageRating, 
  className 
}: RatingStatsProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Average rating display */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">
            {averageRating.toFixed(1)}
          </div>
          <RatingDisplay 
            rating={averageRating} 
            showNumber={false} 
            size="sm"
          />
          <div className="text-xs text-muted-foreground mt-1">
            {totalReviews} reviews
          </div>
        </div>
      </div>
      
      {/* Rating breakdown */}
      <div className="space-y-2">
        {ratings.map((ratingData) => {
          const percentage = totalReviews > 0 ? (ratingData.count / totalReviews) * 100 : 0;
          
          return (
            <div key={ratingData.rating} className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 w-12">
                <span>{ratingData.rating}</span>
                <Star className="w-3 h-3 fill-brand-warning text-brand-warning" />
              </div>
              
              <div className="flex-1">
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className="bg-brand-warning h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              
              <div className="text-muted-foreground w-8 text-right">
                {ratingData.count}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
