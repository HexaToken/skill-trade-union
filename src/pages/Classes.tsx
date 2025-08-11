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
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
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
import { classes, users, skills } from '@/data/courseData';
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
  const [isLoading, setIsLoading] = useState(false);

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
      case 'price-low':
        return a.priceCredits - b.priceCredits;
      case 'price-high':
        return b.priceCredits - a.priceCredits;
      default:
        return 0;
    }
  });

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value !== '';
    if (typeof value === 'boolean') return value;
    if (Array.isArray(value)) return value[0] !== 0 || value[1] !== 500; // price/duration ranges
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
    
    if (variant === 'list') {
      return (
        <Card className="course-card group cursor-pointer" onClick={() => window.open(`/classes/${course.id}`, '_blank')}>
          <CardContent className="p-0">
            <div className="flex gap-4">
              <div className="relative w-64 h-36 shrink-0">
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title}
                  className="w-full h-full object-cover rounded-l-lg"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-l-lg flex items-center justify-center">
                  <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              
              <div className="flex-1 p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-brand-primary transition-colors line-clamp-2 text-foreground">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-xl font-bold text-brand-primary">
                      {course.priceCredits} credits
                    </div>
                  </div>
                </div>
                
                {instructor && (
                  <div className="flex items-center gap-2 mb-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={instructor.avatarUrl} alt={instructor.name} />
                      <AvatarFallback>{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{instructor.name}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "w-3 h-3",
                            i < Math.floor(course.ratingAvg)
                              ? "fill-brand-secondary text-brand-secondary"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {course.ratingAvg} ({course.ratingCount})
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(course.durationMins)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{course.studentsCount.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {course.category}
                  </Badge>
                  {course.type === 'live' && (
                    <Badge className="text-xs bg-brand-green text-white">Live</Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="course-card group cursor-pointer" onClick={() => window.open(`/classes/${course.id}`, '_blank')}>
        <div className="relative">
          <img 
            src={course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-40 object-cover rounded-t-lg"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-t-lg flex items-center justify-center">
            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
            {course.level}
          </Badge>
          {course.type === 'live' && (
            <Badge className="absolute top-3 right-3 bg-brand-green text-white">Live</Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
            {course.title}
          </h3>
          
          {instructor && (
            <p className="text-xs text-muted-foreground mb-2">
              {instructor.name}
            </p>
          )}
          
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "w-3 h-3",
                    i < Math.floor(course.ratingAvg)
                      ? "fill-brand-secondary text-brand-secondary"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {course.ratingAvg} ({course.ratingCount})
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatDuration(course.durationMins)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{course.studentsCount.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs">
              {course.category}
            </Badge>
            <div className="text-right">
              <div className="text-sm font-bold text-brand-primary">
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
      <CollapsibleTrigger className="filter-group w-full">
        <div className="flex items-center justify-between w-full">
          <h3 className="filter-title">{title}</h3>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-4">
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
              <div className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={filters.category === category.name}
                    onCheckedChange={(checked) => {
                      updateFilter('category', checked ? category.name : '');
                    }}
                    className="rounded border-2 data-[state=checked]:bg-[#0056D2] data-[state=checked]:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2] focus:ring-offset-2"
                  />
                  <span className="text-sm text-[#1E293B] dark:text-[#F1F5F9] font-medium">
                    {category.name}
                  </span>
                </div>
                <span className="text-xs text-[#94A3B8] font-medium">
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
            { name: 'Beginner', count: 18, color: 'text-emerald-600' },
            { name: 'Intermediate', count: 14, color: 'text-amber-600' },
            { name: 'Advanced', count: 9, color: 'text-red-600' }
          ].map(level => (
            <label key={level.name} className="group cursor-pointer block">
              <div className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-lg transition-colors">
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
                    className="rounded border-2 data-[state=checked]:bg-[#0056D2] data-[state=checked]:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2] focus:ring-offset-2"
                  />
                  <span className={`text-sm font-medium ${level.color} dark:text-[#F1F5F9]`}>
                    {level.name}
                  </span>
                </div>
                <span className="text-xs text-[#94A3B8] font-medium">
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
              <div className="flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-lg transition-colors">
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
                    className="rounded border-2 data-[state=checked]:bg-[#0056D2] data-[state=checked]:border-[#0056D2] focus:ring-2 focus:ring-[#0056D2] focus:ring-offset-2"
                  />
                  <span className="text-sm text-[#1E293B] dark:text-[#F1F5F9] font-medium">
                    {language.name}
                  </span>
                </div>
                <span className="text-xs text-[#94A3B8] font-medium">
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
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A]">
      {/* Header */}
      <div className="bg-white dark:bg-[#1E293B] py-8 border-b border-slate-200 dark:border-slate-700">
        <div className="page-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-heading font-bold mb-3 text-[#0F172A] dark:text-[#F1F5F9]">All Classes</h1>
              <p className="text-lg text-[#334155] dark:text-[#E2E8F0]">
                Discover {sortedClasses.length} learning opportunities from expert instructors
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Mobile filters */}
              <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white rounded-xl">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 text-xs bg-[#0056D2] text-white">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0 overflow-y-auto bg-white dark:bg-[#1E293B]">
                  <SheetHeader className="p-6 pb-0">
                    <SheetTitle className="text-[#0F172A] dark:text-[#F1F5F9]">Filters</SheetTitle>
                  </SheetHeader>
                  <FiltersPanel />
                </SheetContent>
              </Sheet>

              {/* View mode toggle */}
              <div className="hidden sm:flex rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-[#1E293B] shadow-sm">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`rounded-r-none border-r-0 ${
                    viewMode === 'grid'
                      ? 'bg-[#0056D2] text-white hover:bg-[#004BB8]'
                      : 'hover:bg-[#0056D2]/10 hover:text-[#0056D2]'
                  }`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`rounded-l-none ${
                    viewMode === 'list'
                      ? 'bg-[#06B6D4] text-white hover:bg-[#0891B2]'
                      : 'hover:bg-[#06B6D4]/10 hover:text-[#06B6D4]'
                  }`}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search classes..."
                className="pl-10"
                value={filters.query}
                onChange={(e) => updateFilter('query', e.target.value)}
              />
            </div>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="most-popular">Most Popular</SelectItem>
                <SelectItem value="highest-rated">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A]">
        {/* Left Filter Sidebar - Desktop */}
        <div className="hidden lg:block w-[280px] bg-white dark:bg-[#1E293B] border-r border-slate-200 dark:border-slate-700 p-6">
          <div className="sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#0056D2] font-heading">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-[#06B6D4] hover:underline transition-colors"
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
            <div className="flex flex-wrap gap-3 mb-8 p-4 bg-white dark:bg-[#1E293B] rounded-xl border border-transparent dark:border-[rgba(255,255,255,0.06)] shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
              {filters.category && (
                <Badge variant="secondary" className="flex items-center gap-2 bg-[#06B6D4]/10 text-[#06B6D4] border-[#06B6D4]/20 px-3 py-1 rounded-lg">
                  Category: {filters.category}
                  <button onClick={() => updateFilter('category', '')} className="hover:bg-[#06B6D4]/20 rounded-full p-0.5 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.level && filters.level.length > 0 && (
                <Badge variant="secondary" className="flex items-center gap-2 bg-[#0056D2]/10 text-[#0056D2] border-[#0056D2]/20 px-3 py-1 rounded-lg">
                  Level: {filters.level.join(', ')}
                  <button onClick={() => updateFilter('level', [])} className="hover:bg-[#0056D2]/20 rounded-full p-0.5 transition-colors">
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
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            )}>
              {sortedClasses.map((course) => (
                <ClassCard
                  key={course.id}
                  course={course}
                  variant={viewMode === 'grid' ? 'default' : 'horizontal'}
                />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-white dark:bg-[#1E293B] border border-transparent dark:border-[rgba(255,255,255,0.06)]">
              <div className="w-16 h-16 mx-auto mb-6 bg-[#0056D2]/10 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-[#0056D2]" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#0F172A] dark:text-[#F1F5F9] font-heading">No classes found</h3>
              <p className="text-[#334155] dark:text-[#E2E8F0] mb-8 max-w-md mx-auto leading-relaxed">
                Try adjusting your filters or search terms to discover more learning opportunities.
              </p>
              <Button
                onClick={clearFilters}
                className="bg-[#0056D2] hover:bg-[#004BB8] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Clear all filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
