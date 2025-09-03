import { Star, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CourseCardProps {
  id: string;
  title: string;
  instructor: {
    name: string;
    avatar: string;
  };
  rating: number;
  reviewCount: number;
  tags: string[];
  credits: number;
  duration: string;
  image: string;
  level: string;
  enrolledCount: number;
}

export const CourseCard = ({ 
  id, 
  title, 
  instructor, 
  rating, 
  reviewCount, 
  tags, 
  credits, 
  duration, 
  image, 
  level,
  enrolledCount 
}: CourseCardProps) => {
  return (
    <div className="group bg-surface rounded-xl border border-border shadow-sm hover:shadow-card transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Course Image */}
      <div className="relative aspect-video overflow-hidden bg-elevated">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge 
          className="absolute top-3 right-3 bg-elevated/90 text-ink-body border-border"
        >
          {level}
        </Badge>
      </div>

      {/* Course Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-ink-head line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={instructor.avatar} alt={instructor.name} />
            <AvatarFallback>{instructor.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-ink-body font-medium">
            {instructor.name}
          </span>
        </div>

        {/* Rating & Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-current text-warning" />
            <span className="text-sm font-medium text-ink-head">{rating}</span>
            <span className="text-sm text-ink-body">({reviewCount})</span>
          </div>
          <div className="flex items-center space-x-4 text-sm text-ink-body">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{enrolledCount}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.slice(0, 3).map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="text-xs bg-elevated text-ink-body border-border"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <span className="text-xs text-ink-body">+{tags.length - 3}</span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-ink-head">
            {credits} Credits
          </div>
          <Button 
            size="sm"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};