import { Star, MapPin, MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface SimpleCardProps {
  id: string;
  name: string;
  title: string;
  location: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  skills: string[];
  hourlyRate: number;
  responseTime: string;
  onViewProfile: (id: string) => void;
  onBookSession: (id: string) => void;
}

export const SimpleCard = ({
  id,
  name,
  title,
  location,
  avatar,
  rating,
  reviewCount,
  skills,
  hourlyRate,
  responseTime,
  onViewProfile,
  onBookSession,
}: SimpleCardProps) => {
  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm hover:shadow-card transition-all duration-300 p-6 group">
      {/* Header */}
      <div className="flex items-start space-x-4 mb-4">
        <Avatar className="h-16 w-16 ring-2 ring-border group-hover:ring-primary/50 transition-colors">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback className="text-lg font-semibold">
            {name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-ink-head truncate group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-ink-body text-sm mb-2 line-clamp-2">
            {title}
          </p>
          <div className="flex items-center space-x-1 text-sm text-ink-body">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </div>
      </div>

      {/* Rating & Response */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 fill-warning text-warning" />
          <span className="text-sm font-medium text-ink-head">{rating}</span>
          <span className="text-sm text-ink-body">({reviewCount})</span>
        </div>
        <div className="flex items-center space-x-1 text-sm text-ink-body">
          <MessageCircle className="h-4 w-4" />
          <span>Responds in {responseTime}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          {skills.slice(0, 4).map((skill) => (
            <Badge 
              key={skill}
              variant="secondary"
              className="text-xs bg-elevated text-ink-body border-border hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {skill}
            </Badge>
          ))}
          {skills.length > 4 && (
            <Badge variant="outline" className="text-xs border-border text-ink-body">
              +{skills.length - 4}
            </Badge>
          )}
        </div>
      </div>

      {/* Rate & Actions */}
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-ink-head">
          ${hourlyRate}/hr
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onViewProfile(id)}
            className="border-border hover:border-primary/50 hover:bg-primary/5"
          >
            View Profile
          </Button>
          <Button 
            size="sm"
            onClick={() => onBookSession(id)}
            className="bg-primary hover:bg-primary-dark text-white"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Book
          </Button>
        </div>
      </div>
    </div>
  );
};