import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal,
  Users,
  BookOpen,
  Star,
  MapPin,
  Clock,
  Badge as BadgeIcon,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import MatchCard from '@/components/MatchCard';
import ClassCard from '@/components/ClassCard';
import { users, skills } from '@/data/mockData';
import { courses } from '@/mock/enhanced-data';
import type { Course } from '@/models/expert-types';

interface SearchFilters {
  type: 'all' | 'people' | 'courses';
  categories: string[];
  level: 'beginner' | 'intermediate' | 'advanced' | '';
  location: string;
  availability: 'now' | '24h' | 'date' | '';
  creditsRange: [number, number];
  verifiedOnly: boolean;
  skillTested: boolean;
  onlineOnly: boolean;
}

interface SearchResult {
  type: 'person' | 'course';
  data: any;
  relevanceScore: number;
}

const categories = ['Technology', 'Design', 'Business', 'Languages', 'Creative', 'Music', 'Wellness'];
const locations = ['San Francisco, USA', 'New York, USA', 'London, UK', 'Toronto, Canada', 'Online'];
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'credits', label: 'Lowest Credits' }
];

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'courses'>('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
    categories: [],
    level: '',
    location: '',
    availability: '',
    creditsRange: [0, 50],
    verifiedOnly: false,
    skillTested: false,
    onlineOnly: false
  });

  // Update search query from URL params
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  // Update URL when search changes
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
      setSearchQuery(query.trim());
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchParams({});
  };

  // Mock data transformation for search results
  const mockUsers = users.slice(0, 12).map(user => {
    const primarySkill = user.skillsOffered?.[0];
    const skillData = skills.find(s => s.id === primarySkill?.skillId);

    return {
      name: user.name || 'Unknown User',
      location: (user.location?.city || 'Unknown') + ', ' + (user.location?.country || 'Unknown'),
      avatarUrl: user.avatarUrl || '',
      rating: user.ratingAvg || 4.0,
      reviews: user.ratingCount || 0,
      availabilityNote: 'Available in 2h',
      sameCity: Math.random() > 0.7,
      skillTitle: skillData?.name || 'Web Development',
      category: skillData?.category || 'Technology',
      creditsPerHour: skillData?.baseRateCredits || 25,
      level: 'Level 2',
      blurb: user.bio || 'Experienced professional ready to help you learn.',
      verifiedID: Math.random() > 0.5,
      skillTested: Math.random() > 0.6,
      matchPercent: Math.floor(Math.random() * 30) + 70
    };
  });

  const mockCourses = courses.slice(0, 8).map(course => ({
    ...course,
    category: course.category || (course.skillId === 'web-development' ? 'Technology' :
             course.skillId === 'logo-design' ? 'Design' :
             course.skillId === 'spanish-tutoring' ? 'Languages' :
             course.skillId === 'guitar' ? 'Music' : 'Technology')
  }));

  // Create unified search results
  const searchResults: SearchResult[] = useMemo(() => {
    const results: SearchResult[] = [];
    
    // Add people results
    if (activeTab === 'all' || activeTab === 'people') {
      mockUsers.forEach(user => {
        let relevanceScore = Math.random() * 100;
        
        // Boost relevance if search matches
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if ((user.name?.toLowerCase() || '').includes(query) ||
              (user.skillTitle?.toLowerCase() || '').includes(query) ||
              (user.category?.toLowerCase() || '').includes(query)) {
            relevanceScore += 30;
          }
        }
        
        // Apply filters
        if (filters.categories.length > 0 && !filters.categories.includes(user.category || '')) return;
        if (filters.verifiedOnly && !user.verifiedID) return;
        if (filters.skillTested && !user.skillTested) return;
        if (filters.location && !(user.location || '').includes(filters.location)) return;
        if ((user.creditsPerHour || 0) < filters.creditsRange[0] || (user.creditsPerHour || 0) > filters.creditsRange[1]) return;
        
        results.push({
          type: 'person',
          data: user,
          relevanceScore
        });
      });
    }
    
    // Add course results
    if (activeTab === 'all' || activeTab === 'courses') {
      mockCourses.forEach(course => {
        let relevanceScore = Math.random() * 100;
        
        // Boost relevance if search matches
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          if ((course.title?.toLowerCase() || '').includes(query) ||
              (course.category?.toLowerCase() || '').includes(query) ||
              (course.description?.toLowerCase() || '').includes(query)) {
            relevanceScore += 30;
          }
        }
        
        // Apply filters
        if (filters.categories.length > 0 && !filters.categories.includes(course.category || '')) return;
        if (filters.level) {
          const levelMap = { beginner: 1, intermediate: 2, advanced: 3 };
          if ((course.level || 0) !== levelMap[filters.level]) return;
        }
        if ((course.pricePerSeat || 0) < filters.creditsRange[0] || (course.pricePerSeat || 0) > filters.creditsRange[1]) return;
        
        results.push({
          type: 'course',
          data: course,
          relevanceScore
        });
      });
    }
    
    // Sort results
    return results.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          const aRating = a.type === 'person' ? a.data.rating : a.data.ratingAvg;
          const bRating = b.type === 'person' ? b.data.rating : b.data.ratingAvg;
          return bRating - aRating;
        case 'credits':
          const aCredits = a.type === 'person' ? a.data.creditsPerHour : a.data.pricePerSeat;
          const bCredits = b.type === 'person' ? b.data.creditsPerHour : b.data.pricePerSeat;
          return aCredits - bCredits;
        case 'relevance':
        default:
          return b.relevanceScore - a.relevanceScore;
      }
    });
  }, [searchQuery, activeTab, filters, sortBy, mockUsers, mockCourses]);

  // Filter out results by tab
  const displayResults = searchResults.filter(result => {
    if (activeTab === 'all') return true;
    if (activeTab === 'people') return result.type === 'person';
    if (activeTab === 'courses') return result.type === 'course';
    return true;
  });

  const peopleCount = searchResults.filter(r => r.type === 'person').length;
  const coursesCount = searchResults.filter(r => r.type === 'course').length;

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      categories: [],
      level: '',
      location: '',
      availability: '',
      creditsRange: [0, 50],
      verifiedOnly: false,
      skillTested: false,
      onlineOnly: false
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || 
    filters.level || filters.location || filters.availability ||
    filters.verifiedOnly || filters.skillTested || filters.onlineOnly ||
    (filters.creditsRange[0] !== 0 || filters.creditsRange[1] !== 50);

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Type Filter */}
      <div className="space-y-3">
        <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Type</h4>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'Both', count: peopleCount + coursesCount },
            { value: 'people', label: 'People', count: peopleCount },
            { value: 'courses', label: 'Courses', count: coursesCount }
          ].map(type => (
            <Badge
              key={type.value}
              variant={activeTab === type.value ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:scale-105",
                activeTab === type.value 
                  ? "bg-[#0056D2] text-white hover:bg-[#004BB8]" 
                  : "border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
              )}
              onClick={() => setActiveTab(type.value as any)}
            >
              {type.label} ({type.count})
            </Badge>
          ))}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-3">
        <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Category</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <Badge
              key={category}
              variant={filters.categories.includes(category) ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all duration-200 hover:scale-105",
                filters.categories.includes(category)
                  ? "bg-[#0056D2] text-white hover:bg-[#004BB8]"
                  : "border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
              )}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Level */}
      <div className="space-y-3">
        <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Level</h4>
        <Select value={filters.level} onValueChange={(value) => updateFilter('level', value as any)}>
          <SelectTrigger className="border-[#06B6D4]/20 focus:border-[#0056D2] focus:ring-[#0056D2]">
            <SelectValue placeholder="Any level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any level</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Location */}
      <div className="space-y-3">
        <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Location</h4>
        <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
          <SelectTrigger className="border-[#06B6D4]/20 focus:border-[#0056D2] focus:ring-[#0056D2]">
            <SelectValue placeholder="Any location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any location</SelectItem>
            {locations.map(location => (
              <SelectItem key={location} value={location}>{location}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Availability</h4>
        <Select value={filters.availability} onValueChange={(value) => updateFilter('availability', value as any)}>
          <SelectTrigger className="border-[#06B6D4]/20 focus:border-[#0056D2] focus:ring-[#0056D2]">
            <SelectValue placeholder="Any time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any time</SelectItem>
            <SelectItem value="now">Available Now</SelectItem>
            <SelectItem value="24h">Within 24h</SelectItem>
            <SelectItem value="date">Choose Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Credits Range */}
      <div className="space-y-3">
        <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Credits Range</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-[#334155] dark:text-[#E2E8F0]">
            <span>{filters.creditsRange[0]} credits</span>
            <span>{filters.creditsRange[1]} credits</span>
          </div>
          <Slider
            value={filters.creditsRange}
            onValueChange={(value) => updateFilter('creditsRange', value as [number, number])}
            max={50}
            min={0}
            step={5}
            className="w-full"
          />
        </div>
      </div>

      {/* Verification Toggles */}
      <div className="space-y-4">
        <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Verification</h4>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BadgeIcon className="w-4 h-4 text-emerald-500" />
            <Label htmlFor="verified">ID Verified</Label>
          </div>
          <Switch
            id="verified"
            checked={filters.verifiedOnly}
            onCheckedChange={(checked) => updateFilter('verifiedOnly', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#06B6D4]" />
            <Label htmlFor="skill-tested">Skill Tested</Label>
          </div>
          <Switch
            id="skill-tested"
            checked={filters.skillTested}
            onCheckedChange={(checked) => updateFilter('skillTested', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0056D2]" />
            <Label htmlFor="online-only">Online Only</Label>
          </div>
          <Switch
            id="online-only"
            checked={filters.onlineOnly}
            onCheckedChange={(checked) => updateFilter('onlineOnly', checked)}
          />
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          className="w-full border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
          onClick={clearFilters}
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A]">
      {/* Sticky Search Bar */}
      <div className="sticky top-16 z-40 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border-b border-[#06B6D4]/20">
        <div className="page-container py-4">
          <form onSubmit={handleSearchSubmit} className="relative max-w-4xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#334155] dark:text-[#E2E8F0]" />
            <Input
              name="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, people, or courses…"
              className="w-full pl-12 pr-12 h-14 text-lg rounded-xl border-[#06B6D4]/20 focus:border-[#0056D2] focus:ring-[#0056D2] bg-white dark:bg-[#1E293B]"
            />
            {searchQuery && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0 hover:bg-[#06B6D4]/10"
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </form>
        </div>
      </div>

      <div className="page-container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block">
            <Card className="sticky top-32 bg-white dark:bg-[#1E293B] border-[#06B6D4]/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="w-5 h-5 text-[#0056D2]" />
                  <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] font-heading">Filters</h3>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="bg-[#0056D2]/10 text-[#0056D2]">
                      {[
                        ...filters.categories,
                        filters.level,
                        filters.location,
                        filters.availability,
                        filters.verifiedOnly ? 'Verified' : '',
                        filters.skillTested ? 'Tested' : '',
                        filters.onlineOnly ? 'Online' : ''
                      ].filter(Boolean).length}
                    </Badge>
                  )}
                </div>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Mobile Filter Button & Sort */}
            <div className="flex items-center justify-between gap-4">
              <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                    {hasActiveFilters && (
                      <Badge variant="secondary" className="ml-2 bg-[#0056D2] text-white">
                        {[
                          ...filters.categories,
                          filters.level,
                          filters.location,
                          filters.availability,
                          filters.verifiedOnly ? 'Verified' : '',
                          filters.skillTested ? 'Tested' : '',
                          filters.onlineOnly ? 'Online' : ''
                        ].filter(Boolean).length}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-white dark:bg-[#1E293B]">
                  <SheetHeader>
                    <SheetTitle className="text-[#0F172A] dark:text-[#F1F5F9] font-heading">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48 border-[#06B6D4]/20 focus:border-[#0056D2] focus:ring-[#0056D2]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Results Count */}
            <div className="text-[#334155] dark:text-[#E2E8F0]">
              {searchQuery ? (
                <p>
                  Found <span className="font-semibold text-[#0056D2]">{displayResults.length}</span> results for "{searchQuery}"
                </p>
              ) : (
                <p>
                  Showing <span className="font-semibold text-[#0056D2]">{displayResults.length}</span> results
                </p>
              )}
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white font-semibold rounded-lg"
                >
                  All ({peopleCount + coursesCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="people" 
                  className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white font-semibold rounded-lg"
                >
                  People ({peopleCount})
                </TabsTrigger>
                <TabsTrigger 
                  value="courses" 
                  className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white font-semibold rounded-lg"
                >
                  Courses ({coursesCount})
                </TabsTrigger>
              </TabsList>

              {/* Active Filter Pills */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {filters.categories.map(category => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="bg-[#0056D2]/10 text-[#0056D2] hover:bg-[#0056D2]/20 cursor-pointer"
                      onClick={() => toggleCategory(category)}
                    >
                      {category}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}
                  {filters.level && (
                    <Badge
                      variant="secondary"
                      className="bg-[#0056D2]/10 text-[#0056D2] hover:bg-[#0056D2]/20 cursor-pointer"
                      onClick={() => updateFilter('level', '')}
                    >
                      {filters.level}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                  {filters.location && (
                    <Badge
                      variant="secondary"
                      className="bg-[#0056D2]/10 text-[#0056D2] hover:bg-[#0056D2]/20 cursor-pointer"
                      onClick={() => updateFilter('location', '')}
                    >
                      {filters.location}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}
                </div>
              )}

              <TabsContent value="all" className="mt-6">
                {displayResults.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Search className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
                      No matches found
                    </h3>
                    <p className="text-[#334155] dark:text-[#E2E8F0] mb-6">
                      {searchQuery ? `No results for "${searchQuery}"` : 'Try adjusting your filters'}
                    </p>
                    <Button
                      variant="outline"
                      className="border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white"
                      onClick={clearFilters}
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {displayResults.map((result, index) => (
                      <div key={`${result.type}-${index}`} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                        {result.type === 'person' ? (
                          <MatchCard
                            {...result.data}
                            variant="default"
                            showInstant={false}
                          />
                        ) : (
                          <ClassCard
                            course={result.data}
                            variant="default"
                            onViewDetails={(id) => window.open(`/classes/${id}`, '_blank')}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="people" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayResults
                    .filter(result => result.type === 'person')
                    .map((result, index) => (
                      <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <MatchCard
                          {...result.data}
                          variant="default"
                          showInstant={false}
                        />
                      </div>
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="courses" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {displayResults
                    .filter(result => result.type === 'course')
                    .map((result, index) => (
                      <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <ClassCard
                          course={result.data}
                          variant="default"
                          onViewDetails={(id) => window.open(`/classes/${id}`, '_blank')}
                        />
                      </div>
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
