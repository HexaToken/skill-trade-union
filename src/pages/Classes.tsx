import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Play,
  BookOpen,
  ChevronDown,
  ChevronUp,
  X,
  SlidersHorizontal,
  Grid3X3,
  List,
  Heart,
  Award,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { classes, users, skills } from '@/data/mockData';
import type { SearchFilters } from '@/models/course-types';

interface FilterState extends SearchFilters {
  instructor?: string;
  featured?: boolean;
}

export default function Classes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    level: searchParams.get('level')?.split(',') || [],
    type: searchParams.get('type') as any || 'class',
    priceRange: [
      parseInt(searchParams.get('minPrice') || '0'),
      parseInt(searchParams.get('maxPrice') || '500')
    ],
    duration: [
      parseInt(searchParams.get('minDuration') || '0'),
      parseInt(searchParams.get('maxDuration') || '50')
    ],
    rating: parseFloat(searchParams.get('rating') || '0'),
    language: searchParams.get('languages')?.split(',') || [],
    instructor: searchParams.get('instructor') || '',
    featured: searchParams.get('featured') === 'true'
  });

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'most-popular');

  // Filter section states
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    level: true,
    duration: false,
    price: false,
    rating: false,
    language: false,
    instructor: false,
    features: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      level: [],
      type: 'class',
      priceRange: [0, 500],
      duration: [0, 50],
      rating: 0,
      language: [],
      instructor: '',
      featured: false
    });
  };

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.category) params.set('category', filters.category);
    if (filters.level && filters.level.length > 0) params.set('level', filters.level.join(','));
    if (filters.priceRange) {
      params.set('minPrice', filters.priceRange[0].toString());
      params.set('maxPrice', filters.priceRange[1].toString());
    }
    if (filters.duration) {
      params.set('minDuration', filters.duration[0].toString());
      params.set('maxDuration', filters.duration[1].toString());
    }
    if (filters.rating) params.set('rating', filters.rating.toString());
    if (filters.language && filters.language.length > 0) params.set('languages', filters.language.join(','));
    if (filters.instructor) params.set('instructor', filters.instructor);
    if (filters.featured) params.set('featured', 'true');
    params.set('sort', sortBy);
    
    setSearchParams(params);
  }, [filters, sortBy]);

  // Filter and sort classes
  const filteredClasses = classes.filter(classItem => {
    // Text search
    if (filters.query && !classItem.title.toLowerCase().includes(filters.query.toLowerCase()) && 
        !classItem.description.toLowerCase().includes(filters.query.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category && classItem.category.toLowerCase() !== filters.category.toLowerCase()) {
      return false;
    }
    
    // Level filter
    if (filters.level && filters.level.length > 0 && !filters.level.includes(classItem.level)) {
      return false;
    }
    
    // Price range
    if (filters.priceRange && (classItem.priceCredits < filters.priceRange[0] || classItem.priceCredits > filters.priceRange[1])) {
      return false;
    }
    
    // Duration range (in hours)
    const durationHours = classItem.durationMins / 60;
    if (filters.duration && (durationHours < filters.duration[0] || durationHours > filters.duration[1])) {
      return false;
    }
    
    // Rating filter
    if (filters.rating && classItem.ratingAvg < filters.rating) {
      return false;
    }
    
    // Language filter
    if (filters.language && filters.language.length > 0 && !filters.language.includes(classItem.language)) {
      return false;
    }
    
    // Instructor filter
    if (filters.instructor) {
      const instructor = users.find(u => u.id === classItem.instructorId);
      if (!instructor || !instructor.name.toLowerCase().includes(filters.instructor.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  });

  // Sort classes
  const sortedClasses = [...filteredClasses].sort((a, b) => {
    switch (sortBy) {
      case 'most-popular':
        return b.studentsCount - a.studentsCount;
      case 'highest-rated':
        return b.ratingAvg - a.ratingAvg;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'lowest-credits':
        return a.priceCredits - b.priceCredits;
      default:
        return 0;
    }
  });

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value !== '';
    if (typeof value === 'boolean') return value;
    return false;
  }).length;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const ClassCard = ({ course, variant = 'grid' }: { course: typeof classes[0], variant?: 'grid' | 'list' }) => {
    const instructor = users.find(u => u.id === course.instructorId);
    const [isWishlisted, setIsWishlisted] = useState(false);
    
    if (variant === 'list') {
      return (
        <Card className="group cursor-pointer hover:shadow-md transition-all duration-200 border-border bg-surface">
          <CardContent className="p-0">
            <div className="flex gap-4">
              <div className="relative w-64 h-36 shrink-0 overflow-hidden">
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title}
                  className="w-full h-full object-cover rounded-l-lg group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-l-lg flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-ink-head hover:bg-white/90"
                  >
                    View Details
                  </Button>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsWishlisted(!isWishlisted);
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                >
                  <Heart className={cn("w-4 h-4", isWishlisted ? "fill-red-500 text-red-500" : "text-white")} />
                </button>
              </div>
              
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors line-clamp-2 text-ink-head">
                      {course.title}
                    </h3>
                    <p className="text-sm text-ink-body mb-3 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-primary">
                      {course.priceCredits} credits
                    </div>
                  </div>
                </div>
                
                {instructor && (
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={instructor.avatarUrl} alt={instructor.name} />
                      <AvatarFallback className="text-xs">{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-ink-body">{instructor.name}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "w-3 h-3",
                            i < Math.floor(course.ratingAvg)
                              ? "fill-warning text-warning"
                              : "text-border"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-ink-body">
                      {course.ratingAvg > 0 ? `${course.ratingAvg} (${course.ratingCount})` : 'No ratings yet'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-ink-body">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(course.durationMins)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-ink-body">
                    <Users className="w-4 h-4" />
                    <span>{(course.studentsCount || course.currentSeats || 0).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.category}
                  </Badge>
                  {course.studentsCount > 1000 && (
                    <Badge className="text-xs bg-secondary text-white">Most Popular</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="group cursor-pointer hover:shadow-md transition-all duration-200 border-border bg-surface rounded-lg overflow-hidden">
        <div className="relative overflow-hidden">
          <img 
            src={course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <Button
              variant="secondary"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white text-ink-head hover:bg-white/90"
            >
              View Details
            </Button>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
          >
            <Heart className={cn("w-4 h-4", isWishlisted ? "fill-red-500 text-red-500" : "text-white")} />
          </button>
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge className="bg-white/90 text-ink-head text-xs">
              {course.level}
            </Badge>
            {course.studentsCount > 1000 && (
              <Badge className="bg-secondary text-white text-xs">Most Popular</Badge>
            )}
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors text-ink-head min-h-[2.5rem]">
            {course.title}
          </h3>
          
          {instructor && (
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="w-6 h-6">
                <AvatarImage src={instructor.avatarUrl} alt={instructor.name} />
                <AvatarFallback className="text-xs">{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-ink-body">{instructor.name}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "w-3 h-3",
                    i < Math.floor(course.ratingAvg)
                      ? "fill-warning text-warning"
                      : "text-border"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-ink-body">
              {course.ratingAvg > 0 ? `${course.ratingAvg} (${course.ratingCount})` : 'No ratings yet'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-ink-body mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{course.durationMins ? formatDuration(course.durationMins) : 'Self-paced'}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{(course.studentsCount || course.currentSeats || 0).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {course.category}
            </Badge>
            <div className="text-right">
              <div className="text-sm font-bold text-primary">
                {course.priceCredits} credits
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const FilterSection = ({ title, children, isExpanded, onToggle }: {
    title: string;
    children: React.ReactNode;
    isExpanded: boolean;
    onToggle: () => void;
  }) => (
    <Collapsible open={isExpanded} onOpenChange={onToggle}>
      <CollapsibleTrigger className="group w-full hover:bg-elevated p-3 rounded-lg transition-colors">
        <div className="flex items-center justify-between w-full">
          <h3 className="font-semibold text-base text-ink-head text-left">
            {title}
          </h3>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-ink-body group-hover:text-primary transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-ink-body group-hover:text-primary transition-colors" />
          )}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2 pb-4 px-3">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );

  const FiltersPanel = () => (
    <div className="space-y-6">
      <FilterSection
        title="Category"
        isExpanded={expandedSections.category}
        onToggle={() => toggleSection('category')}
      >
        <div className="space-y-2">
          {[
            { name: 'Technology', count: 12 },
            { name: 'Design', count: 8 },
            { name: 'Business', count: 15 },
            { name: 'Languages', count: 6 },
            { name: 'Creative', count: 10 }
          ].map(category => (
            <label key={category.name} className="group cursor-pointer block">
              <div className="flex items-center justify-between hover:bg-elevated p-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={filters.category === category.name}
                    onCheckedChange={(checked) => {
                      updateFilter('category', checked ? category.name : '');
                    }}
                    className="rounded border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm text-ink-head font-medium">
                    {category.name}
                  </span>
                </div>
                <span className="text-xs text-ink-body font-medium">
                  {category.count}
                </span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Level"
        isExpanded={expandedSections.level}
        onToggle={() => toggleSection('level')}
      >
        <div className="space-y-2">
          {[
            { name: 'Beginner', count: 18 },
            { name: 'Intermediate', count: 14 },
            { name: 'Advanced', count: 9 }
          ].map(level => (
            <label key={level.name} className="group cursor-pointer block">
              <div className="flex items-center justify-between hover:bg-elevated p-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={filters.level?.includes(level.name) || false}
                    onCheckedChange={(checked) => {
                      const currentLevels = filters.level || [];
                      if (checked) {
                        updateFilter('level', [...currentLevels, level.name]);
                      } else {
                        updateFilter('level', currentLevels.filter(l => l !== level.name));
                      }
                    }}
                    className="rounded border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm font-medium text-ink-head">
                    {level.name}
                  </span>
                </div>
                <span className="text-xs text-ink-body font-medium">
                  {level.count}
                </span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection
        title="Language"
        isExpanded={expandedSections.language}
        onToggle={() => toggleSection('language')}
      >
        <div className="space-y-2">
          {[
            { name: 'English', count: 35 },
            { name: 'Spanish', count: 12 },
            { name: 'French', count: 8 },
            { name: 'German', count: 5 }
          ].map(language => (
            <label key={language.name} className="group cursor-pointer block">
              <div className="flex items-center justify-between hover:bg-elevated p-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={filters.language?.includes(language.name) || false}
                    onCheckedChange={(checked) => {
                      const currentLanguages = filters.language || [];
                      if (checked) {
                        updateFilter('language', [...currentLanguages, language.name]);
                      } else {
                        updateFilter('language', currentLanguages.filter(l => l !== language.name));
                      }
                    }}
                    className="rounded border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm text-ink-head font-medium">
                    {language.name}
                  </span>
                </div>
                <span className="text-xs text-ink-body font-medium">
                  {language.count}
                </span>
              </div>
            </label>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-canvas">
      {/* Hero Section */}
      <div className="bg-surface py-8 border-b border-border">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-3 text-ink-head">All Classes</h1>
              <p className="text-lg text-ink-body">
                Discover {sortedClasses.length} learning opportunities from expert instructors
              </p>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-ink-body" />
              <Input
                placeholder="Search classes or instructors…"
                className="pl-10 h-12 bg-elevated border-border focus:border-primary"
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-64 h-12 bg-elevated border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-elevated border-border">
                <SelectItem value="most-popular">Most Popular</SelectItem>
                <SelectItem value="highest-rated">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="lowest-credits">Lowest Credits</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile filters */}
            <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden border-primary text-primary hover:bg-primary hover:text-white h-12">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-primary text-white">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 overflow-y-auto bg-surface">
                <SheetHeader className="p-6 pb-0">
                  <SheetTitle className="text-ink-head">Filters</SheetTitle>
                </SheetHeader>
                <div className="p-6">
                  <FiltersPanel />
                </div>
              </SheetContent>
            </Sheet>

            {/* View mode toggle */}
            <div className="hidden lg:flex rounded-lg border border-border bg-elevated shadow-sm">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className={cn(
                  "rounded-r-none border-r-0 h-12",
                  viewMode === 'grid'
                    ? 'bg-primary text-white hover:bg-primary-600'
                    : 'hover:bg-primary/10 hover:text-primary'
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  "rounded-l-none h-12",
                  viewMode === 'list'
                    ? 'bg-secondary text-white hover:bg-secondary/90'
                    : 'hover:bg-secondary/10 hover:text-secondary'
                )}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex min-h-screen bg-canvas">
        {/* Left Filter Sidebar - Desktop */}
        <div className="hidden lg:block w-[280px] bg-surface border-r border-border p-6">
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-primary">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-secondary hover:underline transition-colors"
              >
                Clear All
              </button>
            </div>
            <FiltersPanel />
          </div>
        </div>

        {/* Course Grid Container */}
        <div className="flex-1 p-6 lg:p-8">
          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-3 mb-8 p-4 bg-surface rounded-lg border border-border shadow-sm">
              {filters.category && (
                <Badge variant="secondary" className="flex items-center gap-2 bg-secondary/10 text-secondary border-secondary/20 px-3 py-1 rounded-lg">
                  Category: {filters.category}
                  <button onClick={() => updateFilter('category', '')} className="hover:bg-secondary/20 rounded-full p-0.5 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.level && filters.level.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-2 bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-lg">
                  Level: {filters.level.join(', ')}
                  <button onClick={() => updateFilter('level', [])} className="hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Course Cards Grid */}
          {sortedClasses.length > 0 ? (
            <div className={cn(
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'
                : 'space-y-4'
            )}>
              {sortedClasses.map((course) => (
                <Link 
                  key={course.id} 
                  to={`/classes/${course.id}`}
                  className="block"
                >
                  <ClassCard
                    course={course}
                    variant={viewMode}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-surface border-border">
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-ink-head">No classes found</h3>
              <p className="text-ink-body mb-8 max-w-md mx-auto leading-relaxed">
                Try adjusting your filters or search terms to discover more learning opportunities.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-primary hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Clear all filters
              </Button>
            </Card>
          )}

          {/* Pagination */}
          {sortedClasses.length > 0 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-2">
                <Button variant="outline" className="border-border hover:bg-primary hover:text-white hover:border-primary">
                  Previous
                </Button>
                <Button className="bg-primary hover:bg-primary-600 text-white">1</Button>
                <Button variant="outline" className="border-border hover:bg-primary hover:text-white hover:border-primary">2</Button>
                <Button variant="outline" className="border-border hover:bg-primary hover:text-white hover:border-primary">3</Button>
                <Button variant="outline" className="border-border hover:bg-primary hover:text-white hover:border-primary">
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
