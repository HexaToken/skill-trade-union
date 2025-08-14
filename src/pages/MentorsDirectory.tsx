import React, { useState, useCallback, useMemo } from "react";
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  X, 
  MapPin, 
  Star, 
  Shield, 
  CheckCircle,
  MessageCircle,
  Calendar,
  Globe,
  Clock,
  Award,
  Heart,
  MoreHorizontal,
  Copy,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

// Types
interface Mentor {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  location: string;
  countryFlag: string;
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
  bio: string;
}

interface Filters {
  category: string[];
  skills: string[];
  level: string[];
  creditsMin: number;
  creditsMax: number;
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
  verified: false,
  languages: [],
  location: "",
};

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevance" },
  { value: "rating", label: "Highest Rated" },
  { value: "sessions", label: "Most Sessions" },
  { value: "credits", label: "Lowest Credits" },
  { value: "availability", label: "Available Soonest" },
];

const CATEGORIES = [
  "Design", "Development", "Business", "Music", "Language", "DIY", "Marketing", "Data Science"
];

const SKILLS = [
  "Figma", "React", "Guitar", "Spanish", "Python", "Photoshop", "Excel", "Public Speaking",
  "JavaScript", "UI/UX", "Branding", "French", "Node.js", "Piano", "Content Writing", "Analytics"
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
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    skills: true,
    level: false,
    verification: false
  });
  const [showMoreSkills, setShowMoreSkills] = useState(false);

  // Mock data - Enhanced with more details
  const mockMentors: Mentor[] = useMemo(() => [
    {
      id: "m101",
      name: "Ava Ramirez",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b056a692?w=150&h=150&fit=crop&crop=face",
      headline: "Brand Designer & Strategy Coach",
      location: "Toronto, CA",
      countryFlag: "🇨🇦",
      languages: ["English", "Spanish"],
      rating: 4.9,
      reviews: 188,
      sessions: 520,
      creditsPerHour: 25,
      verifiedID: true,
      skillTested: true,
      blurb: "I help startups create compelling brand identities that resonate with their target audience and drive business growth.",
      bio: "Brand designer with 8+ years experience working with Fortune 500 companies and startups. I specialize in creating cohesive brand systems that tell compelling stories and connect with audiences on an emotional level.",
      tags: ["Branding", "Figma", "Strategy"],
      category: "Design",
      availability: "available",
      isFeatured: true,
    },
    {
      id: "m42",
      name: "Marcus Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      headline: "Senior UX Designer & React Developer",
      location: "San Francisco, USA",
      countryFlag: "🇺🇸",
      languages: ["English", "Chinese"],
      rating: 4.8,
      reviews: 128,
      sessions: 340,
      creditsPerHour: 30,
      verifiedID: true,
      skillTested: true,
      blurb: "I help teams design user-centered products and build scalable React applications with modern best practices.",
      bio: "Full-stack designer and developer with expertise in user research, prototyping, and React development. I've led design teams at tech startups and mentored hundreds of developers.",
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
      countryFlag: "🇬🇧",
      languages: ["English"],
      rating: 4.7,
      reviews: 94,
      sessions: 210,
      creditsPerHour: 35,
      verifiedID: true,
      skillTested: false,
      blurb: "Teaching modern web development with Node.js, React, and cloud deployment strategies for scalable applications.",
      bio: "Senior full-stack developer with 10+ years experience. I lead engineering teams and specialize in building high-performance web applications using modern JavaScript frameworks.",
      tags: ["JavaScript", "Node.js", "AWS"],
      category: "Development",
      availability: "24h",
    },
    {
      id: "m104",
      name: "Diego Martinez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      headline: "Spanish Language Coach & Cultural Expert",
      location: "Madrid, Spain",
      countryFlag: "🇪🇸",
      languages: ["Spanish", "English"],
      rating: 4.9,
      reviews: 156,
      sessions: 380,
      creditsPerHour: 20,
      verifiedID: true,
      skillTested: true,
      blurb: "Native Spanish speaker helping students achieve fluency through immersive conversational practice and cultural immersion.",
      bio: "Certified language instructor with a passion for helping students connect with Spanish-speaking cultures. I use innovative teaching methods that make learning engaging and practical.",
      tags: ["Spanish", "Conversation", "Grammar"],
      category: "Language",
      availability: "available",
    },
  ], []);

  const featuredMentors = mockMentors.filter(mentor => mentor.isFeatured);
  const allMentors = mockMentors;

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleCategoryChip = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category.includes(category) 
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category]
    }));
  }, []);

  const handleBookNow = useCallback((mentor: Mentor) => {
    setSelectedMentor(mentor);
    setShowBookingModal(true);
  }, []);

  const clearAllFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setActiveFilters([]);
  }, []);

  // Calculate active filters count
  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value !== '';
    return false;
  }).length;

  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero Section with Full-Width Gradient */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary-600 to-secondary">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"20\" height=\"20\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"white\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"10\" cy=\"10\" r=\"1\"/%3E%3C/g%3E%3C/svg%3E')]"}></div>
        </div>
        
        <div className="relative page-container py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Find Your Mentor
            </h1>
            <p className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
              Search a global network of experts ready to teach, guide, and collaborate.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-6">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ink-body" />
              <Input
                placeholder="Search mentors by skill, name, or keyword"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 pr-12 h-14 bg-surface border-0 shadow-lg text-lg focus:ring-2 focus:ring-secondary"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSearch("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-elevated"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Quick Filter Category Chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {CATEGORIES.slice(0, 6).map((category) => (
                <Button
                  key={category}
                  variant={filters.category.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleCategoryChip(category)}
                  className={cn(
                    "rounded-full font-medium transition-all duration-200",
                    filters.category.includes(category)
                      ? "bg-secondary text-white hover:bg-secondary/90 shadow-lg"
                      : "bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
                  )}
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Available Count Badge */}
            <Badge className="bg-secondary/20 text-secondary border-secondary/30 px-4 py-2 text-sm font-medium">
              {allMentors.length} mentors available
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="page-container py-12">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          {!isMobile && (
            <div className="w-80 shrink-0">
              <FiltersSidebar 
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearAll={clearAllFilters}
                expandedSections={expandedSections}
                onToggleSection={toggleSection}
                showMoreSkills={showMoreSkills}
                onToggleShowMoreSkills={() => setShowMoreSkills(!showMoreSkills)}
              />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Row */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
              {/* Sort and Mobile Filter */}
              <div className="flex gap-3 w-full lg:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-surface border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-border">
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
                      <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                          <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-secondary text-white">
                            {activeFiltersCount}
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-full sm:w-80 bg-surface">
                      <SheetHeader>
                        <SheetTitle className="text-ink-head">Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FiltersSidebar 
                          filters={filters}
                          onFilterChange={handleFilterChange}
                          onClearAll={clearAllFilters}
                          expandedSections={expandedSections}
                          onToggleSection={toggleSection}
                          showMoreSkills={showMoreSkills}
                          onToggleShowMoreSkills={() => setShowMoreSkills(!showMoreSkills)}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
              </div>

              {/* Results Count */}
              <div className="text-sm text-ink-body">
                Showing {allMentors.length} of {allMentors.length} mentors
              </div>
            </div>

            {/* Featured Mentors */}
            {featuredMentors.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <Star className="h-6 w-6 text-secondary fill-secondary" />
                  <h2 className="text-2xl font-bold text-ink-head">
                    Featured Mentors
                  </h2>
                  <Badge className="bg-secondary/10 text-secondary border-secondary/20 text-xs font-medium">
                    Top Rated
                  </Badge>
                </div>
                <div className="space-y-6">
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

            {/* All Mentors Grid */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-ink-head mb-6">
                All Mentors
              </h2>
            </div>

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
        <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
          <DialogContent className="max-w-2xl bg-surface border-border">
            <DialogHeader>
              <DialogTitle className="text-ink-head">Book Session with {selectedMentor.name}</DialogTitle>
            </DialogHeader>
            <BookingModalContent 
              mentor={selectedMentor} 
              onClose={() => setShowBookingModal(false)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Filters Sidebar Component with Accordion
interface FiltersSidebarProps {
  filters: Filters;
  onFilterChange: (key: keyof Filters, value: any) => void;
  onClearAll: () => void;
  expandedSections: any;
  onToggleSection: (section: string) => void;
  showMoreSkills: boolean;
  onToggleShowMoreSkills: () => void;
}

const FiltersSidebar: React.FC<FiltersSidebarProps> = ({ 
  filters, 
  onFilterChange, 
  onClearAll, 
  expandedSections, 
  onToggleSection,
  showMoreSkills,
  onToggleShowMoreSkills
}) => {
  const displayedSkills = showMoreSkills ? SKILLS : SKILLS.slice(0, 8);

  return (
    <Card className="bg-surface border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-primary">
            Filters
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-secondary hover:text-secondary/80 hover:bg-secondary/10 px-3"
          >
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <Collapsible open={expandedSections.category} onOpenChange={() => onToggleSection('category')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-elevated rounded-lg transition-colors">
            <h3 className="font-semibold text-ink-head">Category</h3>
            {expandedSections.category ? (
              <ChevronUp className="h-4 w-4 text-ink-body" />
            ) : (
              <ChevronDown className="h-4 w-4 text-ink-body" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {CATEGORIES.map((category) => (
              <label key={category} className="flex items-center space-x-3 cursor-pointer group hover:bg-elevated p-2 rounded-lg transition-colors">
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
                  className="h-4 w-4 rounded border-2 border-primary/30 text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-sm text-ink-body group-hover:text-ink-head transition-colors">{category}</span>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator className="bg-border" />

        {/* Skills Filter */}
        <Collapsible open={expandedSections.skills} onOpenChange={() => onToggleSection('skills')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-elevated rounded-lg transition-colors">
            <h3 className="font-semibold text-ink-head">Skills</h3>
            {expandedSections.skills ? (
              <ChevronUp className="h-4 w-4 text-ink-body" />
            ) : (
              <ChevronDown className="h-4 w-4 text-ink-body" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {displayedSkills.map((skill) => (
              <label key={skill} className="flex items-center space-x-3 cursor-pointer group hover:bg-elevated p-2 rounded-lg transition-colors">
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
                  className="h-4 w-4 rounded border-2 border-primary/30 text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-sm text-ink-body group-hover:text-ink-head transition-colors">{skill}</span>
              </label>
            ))}
            {SKILLS.length > 8 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleShowMoreSkills}
                className="text-primary hover:text-primary-600 hover:bg-primary/10 mt-2"
              >
                {showMoreSkills ? 'Show Less' : `Show More (${SKILLS.length - 8})`}
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>

        <Separator className="bg-border" />

        {/* Experience Level Filter */}
        <Collapsible open={expandedSections.level} onOpenChange={() => onToggleSection('level')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-elevated rounded-lg transition-colors">
            <h3 className="font-semibold text-ink-head">Experience Level</h3>
            {expandedSections.level ? (
              <ChevronUp className="h-4 w-4 text-ink-body" />
            ) : (
              <ChevronDown className="h-4 w-4 text-ink-body" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {LEVELS.map((level) => (
              <label key={level} className="flex items-center space-x-3 cursor-pointer group hover:bg-elevated p-2 rounded-lg transition-colors">
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
                  className="h-4 w-4 rounded border-2 border-primary/30 text-primary focus:ring-primary focus:ring-offset-0"
                />
                <span className="text-sm text-ink-body group-hover:text-ink-head transition-colors">{level}</span>
              </label>
            ))}
          </CollapsibleContent>
        </Collapsible>

        <Separator className="bg-border" />

        {/* Verification Filter */}
        <Collapsible open={expandedSections.verification} onOpenChange={() => onToggleSection('verification')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-2 hover:bg-elevated rounded-lg transition-colors">
            <h3 className="font-semibold text-ink-head">Verification</h3>
            {expandedSections.verification ? (
              <ChevronUp className="h-4 w-4 text-ink-body" />
            ) : (
              <ChevronDown className="h-4 w-4 text-ink-body" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            <label className="flex items-center space-x-3 cursor-pointer group hover:bg-elevated p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={filters.verified}
                onChange={(e) => onFilterChange('verified', e.target.checked)}
                className="h-4 w-4 rounded border-2 border-primary/30 text-primary focus:ring-primary focus:ring-offset-0"
              />
              <span className="text-sm text-ink-body group-hover:text-ink-head transition-colors flex items-center gap-2">
                <Shield className="h-3 w-3" />
                Verified mentors only
              </span>
            </label>
          </CollapsibleContent>
        </Collapsible>

        <Separator className="bg-border" />

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button className="flex-1 bg-primary hover:bg-primary-600 text-white font-semibold">
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Featured Mentor Card Component - Horizontal Spotlight Banner
interface MentorCardProps {
  mentor: Mentor;
  onBookNow: (mentor: Mentor) => void;
}

const FeaturedMentorCard: React.FC<MentorCardProps> = ({ mentor, onBookNow }) => {
  return (
    <Card className="group cursor-pointer overflow-hidden bg-surface border-secondary/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-secondary/20 ring-offset-2 ring-offset-background">
              <AvatarImage src={mentor.avatar} alt={mentor.name} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {mentor.isFeatured && (
              <div className="absolute -top-2 -right-2 h-8 w-8 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                <Star className="h-4 w-4 text-white fill-white" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl text-ink-head group-hover:text-primary transition-colors truncate">
                  {mentor.name}
                </h3>
                <p className="text-sm text-ink-body font-medium truncate mb-2">
                  {mentor.headline}
                </p>
                <p className="text-sm text-ink-body leading-relaxed line-clamp-2">
                  {mentor.bio}
                </p>
              </div>
              <div className="flex flex-col gap-2 ml-4">
                {mentor.verifiedID && (
                  <Badge className="bg-success/10 text-success border-success/20 text-xs font-medium">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                {mentor.skillTested && (
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs font-medium">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Tested
                  </Badge>
                )}
              </div>
            </div>

            <div className="flex items-center flex-wrap gap-4 text-sm text-ink-body mb-4">
              <div className="flex items-center gap-1">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "w-4 h-4",
                        i < Math.floor(mentor.rating) 
                          ? "fill-warning text-warning" 
                          : "text-border"
                      )}
                    />
                  ))}
                </div>
                <span className="font-semibold text-ink-head">{mentor.rating}</span>
                <span>({mentor.reviews})</span>
              </div>
              <span>•</span>
              <span className="font-medium">{mentor.sessions} sessions</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span className="text-lg">{mentor.countryFlag}</span>
                <MapPin className="h-3 w-3" />
                <span className="truncate">{mentor.location}</span>
              </div>
            </div>

            {/* Key Skills */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-medium text-ink-body">Key skills:</span>
              <div className="flex gap-1 flex-wrap">
                {mentor.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs bg-secondary/10 text-secondary border-secondary/30">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">{mentor.creditsPerHour}</span>
                <span className="text-sm text-ink-body">credits/hr</span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white font-medium">
                  View Profile
                </Button>
                <Button className="bg-primary hover:bg-primary-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" onClick={() => onBookNow(mentor)}>
                  Book Session
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Regular Mentor Card Component - Uniform Height with Hover Effects
const MentorCard: React.FC<MentorCardProps> = ({ mentor, onBookNow }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-surface border-border h-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-5 h-full flex flex-col relative">
        {/* Header with Avatar and Info */}
        <div className="flex items-start gap-3 mb-4">
          <div className="relative flex-shrink-0">
            <Avatar className="h-14 w-14 ring-2 ring-primary/10">
              <AvatarImage src={mentor.avatar} alt={mentor.name} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                {mentor.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="font-bold text-base text-ink-head group-hover:text-primary transition-colors truncate">
                  {mentor.name}
                </h3>
                <p className="text-sm text-ink-body font-medium truncate mb-1">
                  {mentor.headline}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-sm">{mentor.countryFlag}</span>
                  <span className="text-xs text-ink-body truncate">{mentor.location}</span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {mentor.verifiedID && (
                  <div className="w-5 h-5 bg-success/10 rounded-full flex items-center justify-center border border-success/20">
                    <Shield className="h-3 w-3 text-success" />
                  </div>
                )}
                {mentor.skillTested && (
                  <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                    <CheckCircle className="h-3 w-3 text-primary" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rating and Sessions */}
        <div className="flex items-center gap-2 text-sm text-ink-body mb-3">
          <div className="flex items-center gap-1">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3",
                    i < Math.floor(mentor.rating)
                      ? "fill-warning text-warning"
                      : "text-border"
                  )}
                />
              ))}
            </div>
            <span className="font-semibold text-ink-head text-sm">{mentor.rating}</span>
            <span className="text-xs">({mentor.reviews})</span>
          </div>
          <span className="text-border">•</span>
          <span className="font-medium text-xs">{mentor.sessions} sessions</span>
        </div>

        {/* Description */}
        <p className="text-sm text-ink-body mb-3 line-clamp-2 flex-1 leading-relaxed">
          {mentor.blurb}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {mentor.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-xs bg-primary/5 text-primary border-primary/25 font-medium hover:bg-primary/10 transition-colors cursor-help"
              title={`Skill: ${tag}`}
            >
              {tag}
            </Badge>
          ))}
          {mentor.tags.length > 3 && (
            <Badge variant="outline" className="text-xs bg-ink-body/5 text-ink-body border-ink-body/25">
              +{mentor.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Footer with Price and Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-primary">{mentor.creditsPerHour}</span>
            <span className="text-xs text-ink-body">credits/hr</span>
          </div>
          <div className="flex gap-2 items-center">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-secondary hover:text-secondary/80 hover:bg-secondary/10 font-medium text-xs px-2 h-8 transition-all duration-200",
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2"
              )}
            >
              <MessageCircle className="h-3 w-3 mr-1" />
              Message
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary-600 text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 text-xs px-3 h-8"
              onClick={() => onBookNow(mentor)}
            >
              Book
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Booking Modal Content
interface BookingModalContentProps {
  mentor: Mentor;
  onClose: () => void;
}

const BookingModalContent: React.FC<BookingModalContentProps> = ({ mentor, onClose }) => {
  return (
    <div className="space-y-6">
      {/* Mentor Summary */}
      <div className="flex items-start gap-4 p-4 bg-elevated rounded-lg border border-border">
        <Avatar className="h-16 w-16">
          <AvatarImage src={mentor.avatar} alt={mentor.name} />
          <AvatarFallback className="bg-primary/10 text-primary font-bold">
            {mentor.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-ink-head">{mentor.name}</h3>
          <p className="text-sm text-ink-body">{mentor.headline}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-warning text-warning" />
              <span className="text-sm font-semibold">{mentor.rating}</span>
            </div>
            <span className="text-sm text-ink-body">•</span>
            <span className="text-sm text-ink-body">{mentor.sessions} sessions</span>
            <span className="text-sm text-ink-body">•</span>
            <span className="text-sm font-semibold text-primary">{mentor.creditsPerHour} credits/hr</span>
          </div>
        </div>
      </div>

      {/* Calendar Picker Placeholder */}
      <div className="p-6 bg-elevated rounded-lg border border-border text-center">
        <Calendar className="h-12 w-12 text-ink-body mx-auto mb-4" />
        <h4 className="font-semibold text-ink-head mb-2">Select Available Time</h4>
        <p className="text-sm text-ink-body mb-4">Calendar integration would go here</p>
        <div className="grid grid-cols-3 gap-2">
          {['9:00 AM', '2:00 PM', '6:00 PM'].map((time) => (
            <Button key={time} variant="outline" size="sm" className="border-primary/20 hover:bg-primary/10">
              {time}
            </Button>
          ))}
        </div>
      </div>

      {/* Confirm Button */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onClose} className="flex-1">
          Cancel
        </Button>
        <Button className="flex-1 bg-primary hover:bg-primary-600 text-white font-semibold">
          Confirm Booking
        </Button>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const MentorGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="bg-surface">
          <CardContent className="p-5">
            <div className="flex items-start gap-4 mb-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-3 w-20" />
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
