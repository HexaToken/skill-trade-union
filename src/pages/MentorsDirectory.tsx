import React, { useState, useCallback, useMemo } from "react";
import { Search, Filter, ChevronDown, X, MapPin, Star, Shield, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useMobile } from "@/hooks/use-mobile";
import BookingModalUnified from "@/components/BookingModalUnified";

// Types
interface Mentor {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  location: string;
  languages: string[];
  rating: number;
  reviews: number;
  sessions: number;
  creditsPerHour: number;
  verifiedID: boolean;
  skillTested: boolean;
  blurb: string;
  tags: string[];
  category: string;
  availability: string;
  isFeatured?: boolean;
}

interface Filters {
  category: string[];
  skills: string[];
  level: string[];
  creditsMin: number;
  creditsMax: number;
  onlineOnly: boolean;
  availableWithin: string;
  verified: boolean;
  languages: string[];
  location: string;
}

const INITIAL_FILTERS: Filters = {
  category: [],
  skills: [],
  level: [],
  creditsMin: 5,
  creditsMax: 100,
  onlineOnly: true,
  availableWithin: "anytime",
  verified: false,
  languages: [],
  location: "",
};

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "Highest Rated" },
  { value: "sessions", label: "Most Sessions" },
  { value: "credits", label: "Lowest Credits" },
  { value: "availability", label: "Availability Soonest" },
];

const CATEGORIES = [
  "Design", "Development", "Business", "Music", "Language", "DIY", "Marketing", "Data Science"
];

const SKILLS = [
  "Figma", "React", "Guitar", "Spanish", "Python", "Photoshop", "Excel", "Public Speaking"
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"];

const LANGUAGES = ["English", "Spanish", "French", "German", "Chinese", "Japanese"];

const MentorsDirectory = () => {
  const isMobile = useMobile();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState<Filters>(INITIAL_FILTERS);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Mock data - In real app this would come from API
  const mockMentors: Mentor[] = useMemo(() => [
    {
      id: "m101",
      name: "Ava Ramirez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b056a692?w=150&h=150&fit=crop&crop=face",
      headline: "Brand Designer & Coach",
      location: "Toronto, CA",
      languages: ["English", "Spanish"],
      rating: 4.9,
      reviews: 188,
      sessions: 520,
      creditsPerHour: 25,
      verifiedID: true,
      skillTested: true,
      blurb: "I help startups create compelling brand identities that resonate with their target audience.",
      tags: ["Branding", "Figma", "Strategy"],
      category: "Design",
      availability: "available",
      isFeatured: true,
    },
    {
      id: "m42",
      name: "Marcus Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      headline: "UX Designer & React Developer",
      location: "San Francisco, USA",
      languages: ["English", "Chinese"],
      rating: 4.8,
      reviews: 128,
      sessions: 340,
      creditsPerHour: 30,
      verifiedID: true,
      skillTested: true,
      blurb: "I help startups refine product UX and build React applications with best practices.",
      tags: ["UI/UX", "React", "Figma"],
      category: "Development",
      availability: "available",
      isFeatured: true,
    },
    {
      id: "m103",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      headline: "Full-Stack Developer & Tech Lead",
      location: "London, UK",
      languages: ["English"],
      rating: 4.7,
      reviews: 94,
      sessions: 210,
      creditsPerHour: 35,
      verifiedID: true,
      skillTested: false,
      blurb: "Teaching modern web development with Node.js, React, and cloud deployment strategies.",
      tags: ["JavaScript", "Node.js", "AWS"],
      category: "Development",
      availability: "24h",
    },
    {
      id: "m104",
      name: "Diego Martinez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      headline: "Spanish Language Coach",
      location: "Madrid, Spain",
      languages: ["Spanish", "English"],
      rating: 4.9,
      reviews: 156,
      sessions: 380,
      creditsPerHour: 20,
      verifiedID: true,
      skillTested: true,
      blurb: "Native Spanish speaker helping students achieve fluency through conversational practice.",
      tags: ["Spanish", "Conversation", "Grammar"],
      category: "Language",
      availability: "available",
    },
  ], []);

  const featuredMentors = mockMentors.filter(mentor => mentor.isFeatured);
  const allMentors = mockMentors;

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // In real app, this would trigger API call
  }, []);

  const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleBookNow = useCallback((mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowBookingModal(true);
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setActiveFilters([]);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-educational-blue-50 to-educational-cyan-50 dark:from-dark border-b">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
              Find Your Mentor
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-6">
              Search a global network of experts ready to teach, guide, and collaborate.
            </p>
            <div className="text-sm text-muted-foreground">
              <Badge variant="secondary" className="font-medium">
                {allMentors.length.toLocaleString()} mentors available
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search & Controls */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search mentors by skill, name, or keyword"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSearch("")}
                  className="absolute right-2 top-2 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Mobile Filter Button */}
            {isMobile && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="w-full lg:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full sm:w-80">
                  <FiltersSidebar 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearAll={clearAllFilters}
                  />
                </SheetContent>
              </Sheet>
            )}
          </div>

          {/* Active Filter Pills */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {filter}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          {!isMobile && (
            <div className="w-80 shrink-0">
              <FiltersSidebar 
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Featured Mentors */}
            {featuredMentors.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-heading font-semibold mb-6">Featured Mentors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredMentors.map((mentor) => (
                    <FeaturedMentorCard 
                      key={mentor.id} 
                      mentor={mentor}
                      onBookNow={handleBookNow}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-semibold">
                All Mentors ({allMentors.length})
              </h2>
            </div>

            {/* Mentors Grid */}
            {isLoading ? (
              <MentorGridSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allMentors.map((mentor) => (
                  <MentorCard 
                    key={mentor.id} 
                    mentor={mentor}
                    onBookNow={handleBookNow}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedMentor && (
        <BookingModalUnified
          mode="mentor"
          isOpen={showBookingModal}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedMentor(null);
          }}
          mentorData={{
            id: selectedMentor.id,
            name: selectedMentor.name,
            avatar: selectedMentor.avatar,
            creditsPerHour: selectedMentor.creditsPerHour,
          }}
        />
      )}
    </div>
  );
};

// Filters Sidebar Component
interface FiltersSidebarProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: any) => void;
  onClearAll: () => void;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({ filters, onFilterChange, onClearAll }) => {
  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <h3 className="font-medium mb-3">Category</h3>
          <div className="space-y-2">
            {CATEGORIES.map((category) => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.category.includes(category)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onFilterChange('category', [...filters.category, category]);
                    } else {
                      onFilterChange('category', filters.category.filter(c => c !== category));
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Skills Filter */}
        <div>
          <h3 className="font-medium mb-3">Skills</h3>
          <div className="space-y-2">
            {SKILLS.map((skill) => (
              <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.skills.includes(skill)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onFilterChange('skills', [...filters.skills, skill]);
                    } else {
                      onFilterChange('skills', filters.skills.filter(s => s !== skill));
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm">{skill}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator />

        {/* Clear Filters */}
        <div className="flex gap-2">
          <Button size="sm" className="flex-1">Apply Filters</Button>
          <Button variant="outline" size="sm" onClick={onClearAll} className="flex-1">
            Clear All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Featured Mentor Card Component
interface MentorCardProps {
  mentor: Mentor;
  onBookNow: (mentor: Mentor) => void;
}

const FeaturedMentorCard: React.FC<MentorCardProps> = ({ mentor, onBookNow }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={mentor.avatar} alt={mentor.name} />
            <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg truncate">{mentor.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{mentor.headline}</p>
              </div>
              <div className="flex gap-1">
                {mentor.verifiedID && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    ID
                  </Badge>
                )}
                {mentor.skillTested && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Skill
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{mentor.rating}</span>
                <span>({mentor.reviews})</span>
              </div>
              <span>•</span>
              <span>{mentor.sessions} sessions</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{mentor.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="font-semibold text-brand-primary">
                {mentor.creditsPerHour} credits/hour
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">View Profile</Button>
                <Button size="sm" onClick={() => onBookNow(mentor)}>
                  Book Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Regular Mentor Card Component
const MentorCard: React.FC<MentorCardProps> = ({ mentor, onBookNow }) => {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={mentor.avatar} alt={mentor.name} />
            <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold group-hover:text-brand-primary transition-colors truncate">
                  {mentor.name}
                </h3>
                <p className="text-sm text-muted-foreground">{mentor.headline}</p>
              </div>
              <div className="flex gap-1">
                {mentor.verifiedID && (
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3" />
                  </Badge>
                )}
                {mentor.skillTested && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle className="h-3 w-3" />
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{mentor.rating}</span>
            <span>({mentor.reviews})</span>
          </div>
          <span>•</span>
          <span>{mentor.sessions} sessions</span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {mentor.blurb}
        </p>

        <div className="flex flex-wrap gap-1 mb-4">
          {mentor.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="font-semibold text-brand-primary">
            {mentor.creditsPerHour} credits/hour
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-brand-secondary">
              View Profile
            </Button>
            <Button size="sm" onClick={() => onBookNow(mentor)}>
              Book Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Loading Skeleton Component
const MentorGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
            <Skeleton className="h-3 w-full mb-2" />
            <Skeleton className="h-3 w-3/4 mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MentorsDirectory;
