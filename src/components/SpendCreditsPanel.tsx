import React from 'react';
import { 
  User, 
  BookOpen, 
  Heart, 
  Star, 
  Clock,
  CreditCard,
  Gift
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface SpendOption {
  id: string;
  type: 'mentor' | 'course' | 'donation';
  title: string;
  subtitle?: string;
  cost: number;
  rating?: number;
  image?: string;
  featured?: boolean;
  action: () => void;
}

interface SpendCreditsPanelProps {
  className?: string;
  suggestedMentors?: Array<{
    id: string;
    name: string;
    skill: string;
    rate: number;
    rating: number;
    avatar?: string;
    featured?: boolean;
    onBook: () => void;
  }>;
  featuredCourses?: Array<{
    id: string;
    title: string;
    instructor: string;
    cost: number;
    rating: number;
    featured?: boolean;
    onEnroll: () => void;
  }>;
  onDonateCredits?: () => void;
}

export default function SpendCreditsPanel({
  className,
  suggestedMentors = [],
  featuredCourses = [],
  onDonateCredits
}: SpendCreditsPanelProps) {

  const donationOptions = [
    {
      id: 'platform',
      title: 'Support SkillSwap',
      subtitle: 'Help maintain and improve the platform',
      cost: 0, // Variable
      icon: <Heart className="w-4 h-4" />
    },
    {
      id: 'scholarship',
      title: 'Scholarship Fund',
      subtitle: 'Sponsor learning opportunities for others',
      cost: 50,
      icon: <Gift className="w-4 h-4" />
    }
  ];

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-brand-primary" />
          Spend Credits
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Suggested Mentors */}
        {suggestedMentors.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Suggested Mentors
            </h4>
            
            <div className="space-y-3">
              {suggestedMentors.slice(0, 3).map((mentor) => (
                <div
                  key={mentor.id}
                  className="p-3 rounded-lg border border-border hover:border-brand-primary/50 transition-all cursor-pointer group hover:shadow-sm"
                  onClick={mentor.onBook}
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-sm truncate">{mentor.name}</h5>
                        {mentor.featured && (
                          <Badge size="sm" className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{mentor.skill}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                          <span>{mentor.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-sm font-semibold text-red-600">
                        −{mentor.rate}
                      </div>
                      <div className="text-xs text-muted-foreground">per hour</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Featured Courses */}
        {featuredCourses.length > 0 && (
          <div>
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Featured Courses
            </h4>
            
            <div className="space-y-3">
              {featuredCourses.slice(0, 3).map((course) => (
                <div
                  key={course.id}
                  className="p-3 rounded-lg border border-border hover:border-brand-primary/50 transition-all cursor-pointer group hover:shadow-sm"
                  onClick={course.onEnroll}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium text-sm truncate">{course.title}</h5>
                        {course.featured && (
                          <Badge size="sm" className="bg-gradient-to-r from-brand-primary to-brand-secondary text-white">
                            Featured
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <span>by {course.instructor}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-orange-400 text-orange-400" />
                          <span>{course.rating}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-semibold text-red-600">
                        −{course.cost}
                      </div>
                      <div className="text-xs text-muted-foreground">total</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Donation Options */}
        <div>
          <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Give Back
          </h4>
          
          <div className="space-y-3">
            {donationOptions.map((option) => (
              <div
                key={option.id}
                className="p-3 rounded-lg border border-border hover:border-brand-primary/50 transition-all cursor-pointer group hover:shadow-sm"
                onClick={onDonateCredits}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-brand-primary group-hover:text-brand-secondary transition-colors">
                      {option.icon}
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-sm">{option.title}</h5>
                      <p className="text-xs text-muted-foreground">{option.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-600">
                      {option.cost === 0 ? 'Any amount' : `−${option.cost}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="pt-4 border-t border-border">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={onDonateCredits}
          >
            <Heart className="w-4 h-4 mr-2" />
            Donate Credits
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
