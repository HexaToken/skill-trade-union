import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, Map, List, Loader2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import FilterPanel from '@/components/FilterPanel';
import MatchCard from '@/components/MatchCard';
import InstantHelpDrawer from '@/components/InstantHelpDrawer';
import { cn } from '@/lib/utils';
import { matchService } from '@/services/api-stubs';
import type { AdvancedSearchFilters, MatchResult } from '@/models/expert-types';
import { users, skills } from '@/data/mockData';

const sortOptions = [
  { value: 'relevance', label: 'Best Match' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'recent', label: 'Most Recent' },
  { value: 'available', label: 'Available Now' },
  { value: 'distance', label: 'Nearest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' }
];

export default function Matches() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // State management
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [sortBy, setSortBy] = useState('relevance');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Initialize filters from URL params
  const [filters, setFilters] = useState<AdvancedSearchFilters>(() => {
    return {
      query: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      mode: searchParams.get('mode') as any || undefined,
      instantAvailable: searchParams.get('instant') === 'true' || undefined,
      availability: searchParams.get('availability') as any || undefined,
      minRating: searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined,
      maxDistance: searchParams.get('maxDistance') ? parseInt(searchParams.get('maxDistance')!) : undefined,
      priceRange: searchParams.get('priceMin') && searchParams.get('priceMax') ? 
        [parseInt(searchParams.get('priceMin')!), parseInt(searchParams.get('priceMax')!)] : undefined,
      languages: searchParams.get('languages')?.split(',').filter(Boolean) || undefined,
      timezone: searchParams.get('timezone') || undefined,
      verified: searchParams.get('verified') === 'true' || undefined,
      hasPortfolio: searchParams.get('portfolio') === 'true' || undefined
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

  // Fetch matches when filters change
  useEffect(() => {
    const fetchMatches = async () => {
      setIsLoading(true);
      try {
        const results = await matchService.search(filters);
        setMatches(results);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [filters]);

  // Mock matches for demo when no API results
  const mockMatches = useMemo((): MatchResult[] => {
    let filteredUsers = users;

    // Apply filters
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(query) ||
        user.bio.toLowerCase().includes(query) ||
        user.skillsOffered.some(skill => {
          const skillData = skills.find(s => s.id === skill.skillId);
          return skillData?.name.toLowerCase().includes(query);
        })
      );
    }

    if (filters.category) {
      filteredUsers = filteredUsers.filter(user =>
        user.skillsOffered.some(skill => {
          const skillData = skills.find(s => s.id === skill.skillId);
          return skillData?.category.toLowerCase() === filters.category?.toLowerCase();
        })
      );
    }

    if (filters.minRating) {
      filteredUsers = filteredUsers.filter(user => user.ratingAvg >= filters.minRating!);
    }

    if (filters.verified) {
      filteredUsers = filteredUsers.filter(user => user.verification.idVerified);
    }

    if (filters.instantAvailable) {
      // Mock instant availability for some users
      filteredUsers = filteredUsers.filter(user => user.id === 'user-1' || user.id === 'user-2');
    }

    // Convert to MatchResult format
    return filteredUsers.map(user => {
      const primarySkill = user.skillsOffered[0];
      const skillData = skills.find(s => s.id === primarySkill?.skillId) || skills[0];
      
      return {
        user,
        skill: skillData,
        matchScore: Math.floor(Math.random() * 30) + 70, // 70-100
        reasons: ['skill complementarity', 'timezone match', 'high rating'],
        distance: user.location.city === 'San Francisco' ? undefined : Math.floor(Math.random() * 5000),
        nextAvailable: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      };
    });
  }, [filters]);

  const displayMatches = matches.length > 0 ? matches : mockMatches;

  // Sort matches
  const sortedMatches = useMemo(() => {
    const sorted = [...displayMatches];
    
    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.user.ratingAvg - a.user.ratingAvg);
      case 'available':
        return sorted.filter(match => 
          !match.nextAvailable || new Date(match.nextAvailable) <= new Date()
        );
      case 'distance':
        return sorted.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      case 'price-low':
        return sorted.sort((a, b) => a.skill.baseRateCredits - b.skill.baseRateCredits);
      case 'price-high':
        return sorted.sort((a, b) => b.skill.baseRateCredits - a.skill.baseRateCredits);
      case 'relevance':
      default:
        return sorted.sort((a, b) => b.matchScore - a.matchScore);
    }
  }, [displayMatches, sortBy]);

  const handleFiltersChange = (newFilters: AdvancedSearchFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleBook = (userId: string, skillId: string) => {
    navigate(`/booking?teacher=${userId}&skill=${skillId}`);
  };

  const handleMessage = (userId: string) => {
    navigate(`/messages?user=${userId}`);
  };

  const handleInstantHelp = (userId: string, skillId: string) => {
    console.log('Starting instant help with:', userId, skillId);
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof AdvancedSearchFilters];
    return value !== undefined && value !== '' && 
           (Array.isArray(value) ? value.length > 0 : true);
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-neutral-100 dark:bg-slate-800">
        <div className="page-container py-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground">Find Your Perfect Match</h1>
                <p className="text-muted-foreground">
                  Discover skilled teachers and passionate learners in your area
                </p>
              </div>

              <InstantHelpDrawer
                trigger={
                  <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary text-white border-0 shadow-lg">
                    Need Help Now?
                  </Button>
                }
              />
            </div>

            {/* Mobile search */}
            <div className="flex gap-3 lg:hidden">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills or people..."
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
            <FilterPanel
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
              variant="sidebar"
              showInstantFilter
              className="border-0 rounded-none"
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50">
          <div className="p-8">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-lg">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="w-5 h-5 animate-spin text-educational-blue" />
                      <span className="font-medium">Searching...</span>
                    </div>
                  ) : (
                    <span className="font-semibold text-slate-800 dark:text-white">
                      <span className="text-educational-blue">{sortedMatches.length}</span> {sortedMatches.length === 1 ? 'match' : 'matches'} found
                    </span>
                  )}
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="text-xs border-educational-cyan text-educational-cyan hover:bg-educational-cyan hover:text-white rounded-xl transition-all duration-200"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-52 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 rounded-xl shadow-lg">
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex rounded-xl border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm">
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={`rounded-r-none border-r-0 ${
                      viewMode === 'list'
                        ? 'bg-educational-blue text-white hover:bg-educational-blue/90'
                        : 'hover:bg-educational-blue/10 hover:text-educational-blue'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'map' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('map')}
                    className={`rounded-l-none ${
                      viewMode === 'map'
                        ? 'bg-educational-cyan text-white hover:bg-educational-cyan/90'
                        : 'hover:bg-educational-cyan/10 hover:text-educational-cyan'
                    }`}
                  >
                    <Map className="w-4 h-4" />
                  </Button>
                </div>
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
            {viewMode === 'list' ? (
              <div className="space-y-6">
                {isLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="flex gap-4">
                            <div className="w-16 h-16 bg-muted rounded-full" />
                            <div className="flex-1 space-y-3">
                              <div className="h-4 bg-muted rounded w-1/3" />
                              <div className="h-3 bg-muted rounded w-1/2" />
                              <div className="h-3 bg-muted rounded w-3/4" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : sortedMatches.length > 0 ? (
                  <div className="grid gap-6">
                    {sortedMatches.map((match) => {
                      const skill = skills.find(s => s.id === match.skill.id);
                      return (
                        <MatchCard
                          key={match.user.id}
                          name={match.user.name}
                          location={`${match.user.location.city}, ${match.user.location.country}`}
                          avatarUrl={match.user.avatarUrl}
                          rating={match.user.ratingAvg}
                          reviews={match.user.ratingCount}
                          availabilityNote={match.nextAvailable ? formatNextAvailable(match.nextAvailable) : "Available now"}
                          sameCity={match.distance !== undefined && match.distance < 50}
                          skillTitle={skill?.name || match.skill.name}
                          category={skill?.category || 'General'}
                          creditsPerHour={skill?.baseRateCredits || 15}
                          level={`Level ${skill?.difficulty || 1}`}
                          blurb={match.user.bio}
                          chips={match.reasons.map(reason => ({
                            label: reason,
                            tone: reason.includes('high rating') ? 'success' as const : 'neutral' as const
                          }))}
                          verifiedID={match.user.verification.idVerified}
                          skillTested={match.user.verification.skillTested}
                          matchPercent={match.matchScore}
                          onViewProfile={() => handleViewProfile(match.user.id)}
                          onBook={() => handleBook(match.user.id, match.skill.id)}
                          onInstantCall={() => handleInstantHelp(match.user.id, match.skill.id)}
                          showInstant={match.user.id === 'user-1' || match.user.id === 'user-2'}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <div className="space-y-4">
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
                          <Search className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">No matches found</h3>
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
            ) : (
              /* Map View */
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto">
                      <Map className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">Map View Coming Soon</h3>
                      <p className="text-muted-foreground">
                        Interactive map with skill clusters and location-based filtering
                      </p>
                    </div>
                    <Button onClick={() => setViewMode('list')}>
                      Switch to List View
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
