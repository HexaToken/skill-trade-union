import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Users, Award, Zap, Star, TrendingUp, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import FilterPanel from '@/components/FilterPanel';
import MentorCard from '@/components/MentorCard';
import InstantHelpDrawer from '@/components/InstantHelpDrawer';
import { cn } from '@/lib/utils';
import type { AdvancedSearchFilters } from '@/models/expert-types';
import { users, skills } from '@/data/mockData';

const sortOptions = [
  { value: 'rating', label: 'Highest Rated' },
  { value: 'experience', label: 'Most Experienced' },
  { value: 'available', label: 'Available Now' },
  { value: 'response-time', label: 'Fastest Response' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' }
];

const tierFilters = [
  { value: 'all', label: 'All Tiers' },
  { value: 'silver', label: 'Silver' },
  { value: 'gold', label: 'Gold' },
  { value: 'platinum', label: 'Platinum' }
];

const stats = [
  { label: 'Expert Mentors', value: '2,500+', icon: Award },
  { label: 'Skills Covered', value: '150+', icon: TrendingUp },
  { label: 'Success Stories', value: '15K+', icon: Star },
  { label: 'Countries', value: '65+', icon: Globe }
];

// Mock mentor data with tiers and rates
const mentorData = users.map((user, index) => ({
  ...user,
  tier: index % 3 === 0 ? 'Platinum' : index % 2 === 0 ? 'Gold' : 'Silver',
  creditsPerHour: index % 3 === 0 ? 40 : index % 2 === 0 ? 25 : 15,
  instantAvailable: index % 4 === 0,
  responseTime: index % 3 === 0 ? '< 1 hour' : index % 2 === 0 ? '< 4 hours' : '< 24 hours'
}));

export default function Mentors() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<AdvancedSearchFilters>(() => {
    return {
      query: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      mentorTier: searchParams.get('tier') as any || undefined,
      instantAvailable: searchParams.get('instant') === 'true' || undefined,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
      priceRange: searchParams.get('priceMin') && searchParams.get('priceMax') ? 
        [parseInt(searchParams.get('priceMin')!), parseInt(searchParams.get('priceMax')!)] : undefined,
      languages: searchParams.get('languages')?.split(',').filter(Boolean) || undefined,
      verified: searchParams.get('verified') === 'true' || undefined,
      responseTime: searchParams.get('responseTime') as any || undefined
    };
  });

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && 
          !(Array.isArray(value) && value.length === 0)) {
        if (Array.isArray(value)) {
          if (key === 'priceRange') {
            params.set('priceMin', value[0].toString());
            params.set('priceMax', value[1].toString());
          } else {
            params.set(key, value.join(','));
          }
        } else if (typeof value === 'boolean') {
          params.set(key, value.toString());
        } else {
          params.set(key, value.toString());
        }
      }
    });

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Filter and sort mentors
  const filteredMentors = useMemo(() => {
    let filtered = [...mentorData];

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(mentor =>
        mentor.name.toLowerCase().includes(query) ||
        mentor.bio.toLowerCase().includes(query) ||
        mentor.skillsOffered.some(skill => {
          const skillData = skills.find(s => s.id === skill.skillId);
          return skillData?.name.toLowerCase().includes(query);
        })
      );
    }

    if (filters.category) {
      filtered = filtered.filter(mentor =>
        mentor.skillsOffered.some(skill => {
          const skillData = skills.find(s => s.id === skill.skillId);
          return skillData?.category.toLowerCase() === filters.category?.toLowerCase();
        })
      );
    }

    if (filters.mentorTier && filters.mentorTier !== 'all') {
      filtered = filtered.filter(mentor => 
        mentor.tier.toLowerCase() === filters.mentorTier?.toLowerCase()
      );
    }

    if (filters.minRating) {
      filtered = filtered.filter(mentor => mentor.ratingAvg >= filters.minRating!);
    }

    if (filters.priceRange) {
      filtered = filtered.filter(mentor => 
        mentor.creditsPerHour >= filters.priceRange![0] && 
        mentor.creditsPerHour <= filters.priceRange![1]
      );
    }

    if (filters.verified) {
      filtered = filtered.filter(mentor => mentor.verification.idVerified);
    }

    if (filters.instantAvailable) {
      filtered = filtered.filter(mentor => mentor.instantAvailable);
    }

    // Sort mentors
    switch (sortBy) {
      case 'experience':
        return filtered.sort((a, b) => b.ratingCount - a.ratingCount);
      case 'available':
        return filtered.filter(mentor => mentor.instantAvailable);
      case 'response-time':
        return filtered.sort((a, b) => {
          const timeOrder = { '< 1 hour': 1, '< 4 hours': 2, '< 24 hours': 3 };
          return timeOrder[a.responseTime as keyof typeof timeOrder] - timeOrder[b.responseTime as keyof typeof timeOrder];
        });
      case 'price-low':
        return filtered.sort((a, b) => a.creditsPerHour - b.creditsPerHour);
      case 'price-high':
        return filtered.sort((a, b) => b.creditsPerHour - a.creditsPerHour);
      case 'popular':
        return filtered.sort((a, b) => b.ratingCount - a.ratingCount);
      case 'rating':
      default:
        return filtered.sort((a, b) => b.ratingAvg - a.ratingAvg);
    }
  }, [filters, sortBy]);

  const handleFiltersChange = (newFilters: AdvancedSearchFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleViewProfile = (mentorId: string) => {
    navigate(`/profile/${mentorId}`);
  };

  const handleRequestMentorship = (mentorId: string) => {
    navigate(`/booking?mentor=${mentorId}&type=mentorship`);
  };

  const handleMessage = (mentorId: string) => {
    navigate(`/messages?user=${mentorId}`);
  };

  const handleInstantCall = (mentorId: string) => {
    console.log('Starting instant call with mentor:', mentorId);
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof AdvancedSearchFilters];
    return value !== undefined && value !== '' && 
           (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="page-container py-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold">Find Your Mentor</h1>
                <p className="text-muted-foreground text-lg">
                  Connect with expert mentors for personalized guidance and career growth
                </p>
              </div>
              
              <InstantHelpDrawer
                trigger={
                  <Button className="bg-gradient-to-r from-brand-amber to-brand-green hover:from-brand-amber/90 hover:to-brand-green/90 text-white border-0">
                    <Zap className="w-4 h-4 mr-2" />
                    Instant Help
                  </Button>
                }
              />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-primary/10 rounded-lg">
                      <Icon className="w-6 h-6 text-brand-primary" />
                    </div>
                    <div className="text-2xl font-bold font-heading">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Mobile search */}
            <div className="flex gap-3 lg:hidden">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search mentors or skills..."
                  value={filters.query || ''}
                  onChange={(e) => handleFiltersChange({ ...filters, query: e.target.value || undefined })}
                  className="pl-10"
                />
              </div>
              
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Filter className="h-4 w-4" />
                    {hasActiveFilters && (
                      <Badge size="sm" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                        !
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                  <SheetHeader className="p-6 pb-4">
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="px-6 pb-6 overflow-y-auto">
                    <FilterPanel
                      filters={filters}
                      onFiltersChange={handleFiltersChange}
                      onClearFilters={handleClearFilters}
                      variant="modal"
                      showInstantFilter
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar - Desktop Filters */}
        <aside className="hidden lg:block w-80 border-r bg-card">
          <div className="sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Search */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Search</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search mentors or skills..."
                    value={filters.query || ''}
                    onChange={(e) => handleFiltersChange({ ...filters, query: e.target.value || undefined })}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Tier Filter */}
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Mentor Tier</h4>
                <Select 
                  value={filters.mentorTier || 'all'} 
                  onValueChange={(value) => handleFiltersChange({ 
                    ...filters, 
                    mentorTier: value === 'all' ? undefined : value as any
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tierFilters.map((tier) => (
                      <SelectItem key={tier.value} value={tier.value}>
                        {tier.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Additional filters */}
              <FilterPanel
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                variant="inline"
                showInstantFilter
                className="border-0 p-0"
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="p-6">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    <span>
                      {filteredMentors.length} {filteredMentors.length === 1 ? 'mentor' : 'mentors'} found
                    </span>
                  )}
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-xs"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.entries(filters).map(([key, value]) => {
                  if (value === undefined || value === '' || 
                      (Array.isArray(value) && value.length === 0)) return null;

                  const displayValue = Array.isArray(value) ? value.join(', ') : 
                                    typeof value === 'boolean' ? (value ? 'Yes' : 'No') :
                                    value.toString();

                  return (
                    <Badge key={key} variant="secondary" className="gap-1">
                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                      <span>{displayValue}</span>
                    </Badge>
                  );
                })}
              </div>
            )}

            {/* Results */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 bg-muted rounded-full" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-muted rounded w-3/4" />
                          <div className="h-3 bg-muted rounded w-1/2" />
                          <div className="h-3 bg-muted rounded w-2/3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredMentors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map((mentor) => (
                  <MentorCard
                    key={mentor.id}
                    mentor={mentor}
                    tier={mentor.tier as any}
                    creditsPerHour={mentor.creditsPerHour}
                    instantAvailable={mentor.instantAvailable}
                    onViewProfile={handleViewProfile}
                    onRequestMentorship={handleRequestMentorship}
                    onMessage={handleMessage}
                    onInstantCall={handleInstantCall}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">No mentors found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your filters or search criteria
                      </p>
                    </div>
                    <Button onClick={handleClearFilters}>
                      Clear All Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
