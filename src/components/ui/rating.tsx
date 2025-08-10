import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showNumber?: boolean;
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export function Rating({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  showNumber = true, 
  interactive = false,
  onRatingChange,
  className 
}: RatingProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4", 
    lg: "w-5 h-5"
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base"
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }).map((_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= Math.floor(rating);
          const isHalfFilled = starValue === Math.ceil(rating) && rating % 1 !== 0;
          
          return (
            <button
              key={index}
              disabled={!interactive}
              onClick={() => interactive && onRatingChange?.(starValue)}
              className={cn(
                "relative",
                interactive && "hover:scale-110 transition-transform cursor-pointer",
                !interactive && "cursor-default"
              )}
            >
              <Star 
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  isFilled 
                    ? "fill-brand-amber text-brand-amber" 
                    : "fill-muted text-muted-foreground"
                )}
              />
              {isHalfFilled && (
                <Star 
                  className={cn(
                    sizeClasses[size],
                    "absolute inset-0 fill-brand-amber text-brand-amber",
                    "clip-path-[polygon(0_0,50%_0,50%_100%,0_100%)]"
                  )}
                  style={{ clipPath: "polygon(0 0, 50% 0, 50% 100%, 0 100%)" }}
                />
              )}
            </button>
          );
        })}
      </div>
      {showNumber && (
        <span className={cn("font-medium text-foreground", textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
