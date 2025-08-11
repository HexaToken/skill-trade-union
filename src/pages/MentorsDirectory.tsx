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
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
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
    <div className="min-h-screen bg-white dark:bg-[#0F172A]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0056D2]/5 to-[#06B6D4]/5 dark:from-[#0F172A] dark:to-[#1E293B] border-b">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-heading font-bold bg-gradient-to-r from-[#0056D2] to-[#06B6D4] bg-clip-text text-transparent mb-4">
              Find Your Mentor
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-6">
              Search a global network of experts ready to teach, guide, and collaborate.
            </p>
            <div className="text-sm text-muted-foreground">
              <Badge variant="secondary" className="bg-[#0056D2]/10 text-[#0056D2] border-[#0056D2]/20 font-medium">
                {allMentors.length.toLocaleString()} mentors available
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Search & Controls */}
      <div className="sticky top-0 z-40 bg-[#F8FAFC] dark:bg-[#0F172A] backdrop-blur-sm border-b border-[#E2E8F0] dark:border-[#334155]">
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
                <Badge key={index} variant="secondary" className="text-xs bg-[#0056D2]/10 text-[#0056D2] border-[#0056D2]/20">
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
                <div className="flex items-center gap-3 mb-6">
                  <Star className="h-6 w-6 text-[#0056D2] fill-[#0056D2]" />
                  <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-[#0056D2] to-[#06B6D4] bg-clip-text text-transparent">
                    Featured Mentors
                  </h2>
                  <Badge className="bg-[#0056D2]/10 text-[#0056D2] border-[#0056D2]/20 text-xs font-medium">
                    Top Rated
                  </Badge>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-heading font-bold text-[#0F172A] dark:text-[#F1F5F9]">
                  All Mentors
                </h2>
                <Badge variant="outline" className="bg-[#0056D2]/10 text-[#0056D2] border-[#0056D2]/20 font-medium">
                  {allMentors.length} available
                </Badge>
              </div>
              <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                Sorted by relevance
              </div>
            </div>

            {/* Mentors Grid */}
            {isLoading ? (
              <MentorGridSkeleton />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
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
            avatarUrl: selectedMentor.avatar,
            rate: selectedMentor.creditsPerHour,
            availability: ["Available"],
            verified: selectedMentor.verifiedID,
            skillTested: selectedMentor.skillTested,
            location: selectedMentor.location,
            timezone: "UTC",
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
    <Card className="h-fit shadow-sm border-[#0056D2]/10 dark:border-[#06B6D4]/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-heading bg-gradient-to-r from-[#0056D2] to-[#06B6D4] bg-clip-text text-transparent">
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-[#0F172A] dark:text-[#F1F5F9] font-heading text-sm uppercase tracking-wide">Category</h3>
          <div className="space-y-3">
            {CATEGORIES.map((category) => (
              <label key={category} className="flex items-center space-x-3 cursor-pointer group hover:bg-[#0056D2]/5 p-2 rounded-lg transition-all duration-200">
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
                  className="h-4 w-4 rounded border-2 border-[#0056D2]/30 text-[#0056D2] focus:ring-[#0056D2] focus:ring-offset-0"
                />
                <span className="text-sm text-[#334155] dark:text-[#E2E8F0] group-hover:text-[#0056D2] transition-colors">{category}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="bg-[#0056D2]/10" />

        {/* Skills Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-[#0F172A] dark:text-[#F1F5F9] font-heading text-sm uppercase tracking-wide">Skills</h3>
          <div className="space-y-3">
            {SKILLS.map((skill) => (
              <label key={skill} className="flex items-center space-x-3 cursor-pointer group hover:bg-[#0056D2]/5 p-2 rounded-lg transition-all duration-200">
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
                  className="h-4 w-4 rounded border-2 border-[#0056D2]/30 text-[#0056D2] focus:ring-[#0056D2] focus:ring-offset-0"
                />
                <span className="text-sm text-[#334155] dark:text-[#E2E8F0] group-hover:text-[#0056D2] transition-colors">{skill}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="bg-[#0056D2]/10" />

        {/* Level Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-[#0F172A] dark:text-[#F1F5F9] font-heading text-sm uppercase tracking-wide">Experience Level</h3>
          <div className="space-y-3">
            {LEVELS.map((level) => (
              <label key={level} className="flex items-center space-x-3 cursor-pointer group hover:bg-[#0056D2]/5 p-2 rounded-lg transition-all duration-200">
                <input
                  type="checkbox"
                  checked={filters.level.includes(level)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onFilterChange('level', [...filters.level, level]);
                    } else {
                      onFilterChange('level', filters.level.filter(l => l !== level));
                    }
                  }}
                  className="h-4 w-4 rounded border-2 border-[#0056D2]/30 text-[#0056D2] focus:ring-[#0056D2] focus:ring-offset-0"
                />
                <span className="text-sm text-[#334155] dark:text-[#E2E8F0] group-hover:text-[#0056D2] transition-colors">{level}</span>
              </label>
            ))}
          </div>
        </div>

        <Separator className="bg-[#0056D2]/10" />

        {/* Verification Filter */}
        <div>
          <h3 className="font-semibold mb-3 text-[#0F172A] dark:text-[#F1F5F9] font-heading text-sm uppercase tracking-wide">Verification</h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer group hover:bg-[#0056D2]/5 p-2 rounded-lg transition-all duration-200">
              <input
                type="checkbox"
                checked={filters.verified}
                onChange={(e) => onFilterChange('verified', e.target.checked)}
                className="h-4 w-4 rounded border-2 border-[#0056D2]/30 text-[#0056D2] focus:ring-[#0056D2] focus:ring-offset-0"
              />
              <span className="text-sm text-[#334155] dark:text-[#E2E8F0] group-hover:text-[#0056D2] transition-colors flex items-center gap-2">
                <Shield className="h-3 w-3" />
                Verified mentors only
              </span>
            </label>
          </div>
        </div>

        <Separator className="bg-[#0056D2]/10" />

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1 bg-[#0056D2] hover:bg-[#004BB8] text-white font-semibold shadow-sm transition-all duration-200">
            Apply Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="flex-1 text-[#06B6D4] border-[#06B6D4]/30 hover:bg-[#06B6D4]/10 hover:border-[#06B6D4]/50 transition-all duration-200"
          >
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
    <Card className="glass-card hover-lift transition-all duration-300 group border-[#0056D2]/15 bg-gradient-to-br from-white via-[#0056D2]/1 to-[#06B6D4]/2 dark:from-[#1E293B] dark:via-[#0056D2]/5 dark:to-[#06B6D4]/3">
      <CardContent className="p-6">
        <div className="flex items-start gap-5">
          <div className="relative">
            <Avatar className="h-20 w-20 ring-2 ring-[#0056D2]/20 ring-offset-2 ring-offset-background">
              <AvatarImage src={mentor.avatar} alt={mentor.name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-[#0056D2]/10 to-[#06B6D4]/10 text-[#0056D2] font-bold text-lg">
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {mentor.isFeatured && (
              <div className="absolute -top-2 -right-2 h-7 w-7 bg-gradient-to-r from-[#0056D2] to-[#06B6D4] rounded-full flex items-center justify-center shadow-lg">
                <Star className="h-4 w-4 text-white fill-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-xl text-[#0F172A] dark:text-[#F1F5F9] group-hover:text-[#0056D2] transition-colors truncate">
                  {mentor.name}
                </h3>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] font-medium truncate">
                  {mentor.headline}
                </p>
              </div>
              <div className="flex flex-col gap-1 ml-3">
                {mentor.verifiedID && (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs font-medium dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {mentor.skillTested && (
                  <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Tested
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-3 text-sm text-[#64748B] dark:text-[#94A3B8] mb-4">
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-[#0056D2] text-[#0056D2]" />
                <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{mentor.rating}</span>
                <span>({mentor.reviews})</span>
              </div>
              <span className="text-[#CBD5E1] hidden sm:inline">•</span>
              <span className="font-medium">{mentor.sessions} sessions</span>
              <span className="text-[#CBD5E1] hidden sm:inline">•</span>
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span className="truncate">{mentor.location}</span>
              </div>
            </div>

            {/* Languages */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">Languages:</span>
              <div className="flex gap-1 flex-wrap">
                {mentor.languages.slice(0, 2).map((lang) => (
                  <Badge key={lang} variant="outline" className="text-xs bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/30">
                    {lang}
                  </Badge>
                ))}
                {mentor.languages.length > 2 && (
                  <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200">
                    +{mentor.languages.length - 2}
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#0056D2]/10">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-[#0056D2]">{mentor.creditsPerHour}</span>
                <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">credits/hr</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-[#06B6D4] border-[#06B6D4]/30 hover:bg-[#06B6D4]/10 hover:border-[#06B6D4]/50 font-medium bg-white dark:bg-[#1E293B]">
                  View
                </Button>
                <Button size="sm" className="bg-[#0056D2] hover:bg-[#004BB8] text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200" onClick={() => onBookNow(mentor)}>
                  Book
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
    <Card className="glass-card hover-lift transition-all duration-300 group border-[#0056D2]/10 h-full bg-white/50 dark:bg-[#1E293B]/50 backdrop-blur-sm">
      <CardContent className="p-5 h-full flex flex-col">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Avatar className="h-14 w-14 ring-1 ring-[#0056D2]/20 ring-offset-1 ring-offset-background">
              <AvatarImage src={mentor.avatar} alt={mentor.name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-[#0056D2]/10 to-[#06B6D4]/10 text-[#0056D2] font-bold">
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-heading font-bold text-lg text-[#0F172A] dark:text-[#F1F5F9] group-hover:text-[#0056D2] transition-colors truncate">
                  {mentor.name}
                </h3>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8] font-medium truncate">
                  {mentor.headline}
                </p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {mentor.verifiedID && (
                  <div className="w-6 h-6 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
                    <Shield className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                  </div>
                )}
                {mentor.skillTested && (
                  <div className="w-6 h-6 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-800">
                    <CheckCircle className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-sm text-[#64748B] dark:text-[#94A3B8] mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-[#0056D2] text-[#0056D2]" />
            <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{mentor.rating}</span>
            <span>({mentor.reviews})</span>
          </div>
          <span className="text-[#CBD5E1] hidden sm:inline">•</span>
          <span className="font-medium">{mentor.sessions} sessions</span>
        </div>

        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-4 line-clamp-2 flex-1 leading-relaxed">
          {mentor.blurb}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {mentor.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs bg-[#0056D2]/5 text-[#0056D2] border-[#0056D2]/25 font-medium hover:bg-[#0056D2]/10 transition-colors">
              {tag}
            </Badge>
          ))}
          {mentor.tags.length > 3 && (
            <Badge variant="outline" className="text-xs bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700">
              +{mentor.tags.length - 3}
            </Badge>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#0056D2]/10 mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#0056D2]">{mentor.creditsPerHour}</span>
            <span className="text-xs text-[#64748B] dark:text-[#94A3B8] font-medium">credits/hr</span>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-[#06B6D4] hover:text-[#0891B2] hover:bg-[#06B6D4]/10 font-medium text-xs px-3 bg-transparent">
              View
            </Button>
            <Button size="sm" className="bg-[#0056D2] hover:bg-[#004BB8] text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 text-xs px-4" onClick={() => onBookNow(mentor)}>
              Book
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
