import { useState } from 'react';
import { Search, Filter, X, MapPin, Star, Clock, DollarSign, Globe, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { AdvancedSearchFilters } from '@/models/expert-types';

interface FilterPanelProps {
  filters: AdvancedSearchFilters;
  onFiltersChange: (filters: AdvancedSearchFilters) => void;
  className?: string;
  variant?: 'sidebar' | 'modal' | 'inline';
  showInstantFilter?: boolean;
  showMapToggle?: boolean;
  onClearFilters?: () => void;
}

const categories = [
  'Technology', 'Design', 'Languages', 'Music', 'Business', 
  'Creative', 'Wellness', 'Lifestyle', 'Mechanical', 'All'
];

const languages = [
  'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 
  'Portuguese', 'Russian', 'Arabic', 'Hindi'
];

const timezones = [
  'America/Los_Angeles', 'America/New_York', 'Europe/London', 
  'Europe/Paris', 'Asia/Tokyo', 'Asia/Shanghai', 'Australia/Sydney'
];

export default function FilterPanel({
  filters,
  onFiltersChange,
  className,
  variant = 'sidebar',
  showInstantFilter = true,
  showMapToggle = false,
  onClearFilters
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const updateFilter = (key: keyof AdvancedSearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleArrayFilter = (key: keyof AdvancedSearchFilters, value: string) => {
    const current = (filters[key] as string[]) || [];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFilter(key, updated.length > 0 ? updated : undefined);
  };

  const hasActiveFilters = Object.keys(filters).some(key => {
    const value = filters[key as keyof AdvancedSearchFilters];
    if (value === undefined || value === null) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim() !== '';
    return true;
  });

  const FilterSection = ({ title, children, defaultOpen = true }: { 
    title: string; 
    children: React.ReactNode;
    defaultOpen?: boolean;
  }) => (
    <div className="space-y-3">
      <h4 className="font-medium text-sm flex items-center gap-2">
        {title}
      </h4>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );

  const content = (
    <div className="space-y-6">
      {/* Search Query */}
      <FilterSection title="Search">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search skills, people, or classes..."
            value={filters.query || ''}
            onChange={(e) => updateFilter('query', e.target.value || undefined)}
            className="pl-10"
          />
        </div>
      </FilterSection>

      {/* Instant Availability */}
      {showInstantFilter && (
        <FilterSection title="Availability">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-secondary" />
              <Label htmlFor="instant-available" className="text-sm">
                Available for instant help
              </Label>
            </div>
            <Switch
              id="instant-available"
              checked={filters.instantAvailable || false}
              onCheckedChange={(checked) => updateFilter('instantAvailable', checked || undefined)}
            />
          </div>
          
          <Select value={filters.availability} onValueChange={(value) => updateFilter('availability', value)}>
            <SelectTrigger>
              <SelectValue placeholder="When do you need help?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="now">Right now</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="anytime">Anytime</SelectItem>
            </SelectContent>
          </Select>
        </FilterSection>
      )}

      {/* Category */}
      <FilterSection title="Category">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={filters.category === category ? "default" : "outline"}
              className={cn(
                "cursor-pointer hover-scale",
                filters.category === category && "bg-brand-primary hover:bg-brand-primary"
              )}
              onClick={() => updateFilter('category', filters.category === category ? undefined : category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </FilterSection>

      {/* Mode */}
      <FilterSection title="Learning Mode">
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'virtual', label: 'Virtual' },
            { value: 'in-person', label: 'In-Person' },
            { value: 'async', label: 'Async' }
          ].map((mode) => (
            <Badge
              key={mode.value}
              variant={filters.mode === mode.value ? "default" : "outline"}
              className={cn(
                "cursor-pointer hover-scale",
                filters.mode === mode.value && "bg-brand-primary hover:bg-brand-primary"
              )}
              onClick={() => updateFilter('mode', filters.mode === mode.value ? undefined : mode.value)}
            >
              {mode.label}
            </Badge>
          ))}
        </div>
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Minimum Rating">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
            <span className="text-sm font-medium">
              {filters.minRating ? `${filters.minRating}+ stars` : 'Any rating'}
            </span>
          </div>
          <Slider
            value={[filters.minRating || 0]}
            onValueChange={([value]) => updateFilter('minRating', value > 0 ? value : undefined)}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
        </div>
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range (Credits/Hour)">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">
              {filters.priceRange ? 
                `${filters.priceRange[0]} - ${filters.priceRange[1]} credits` : 
                'Any price'
              }
            </span>
          </div>
          <Slider
            value={filters.priceRange || [0, 50]}
            onValueChange={(range) => updateFilter('priceRange', range[0] === 0 && range[1] === 50 ? undefined : range)}
            max={50}
            min={0}
            step={5}
            className="w-full"
          />
        </div>
      </FilterSection>

      {/* Distance */}
      <FilterSection title="Maximum Distance">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">
              {filters.maxDistance ? 
                `Within ${filters.maxDistance}km` : 
                'Any distance'
              }
            </span>
          </div>
          <Slider
            value={[filters.maxDistance || 100]}
            onValueChange={([value]) => updateFilter('maxDistance', value < 100 ? value : undefined)}
            max={100}
            min={1}
            step={5}
            className="w-full"
          />
        </div>
      </FilterSection>

      {/* Languages */}
      <FilterSection title="Languages">
        <div className="space-y-2">
          <div className="flex flex-wrap gap-1">
            {(filters.languages || []).map((lang) => (
              <Badge key={lang} variant="default" className="text-xs">
                {lang}
                <button
                  onClick={() => toggleArrayFilter('languages', lang)}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <Select onValueChange={(value) => toggleArrayFilter('languages', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Add language..." />
            </SelectTrigger>
            <SelectContent>
              {languages
                .filter(lang => !filters.languages?.includes(lang))
                .map((lang) => (
                  <SelectItem key={lang} value={lang}>
                    {lang}
                  </SelectItem>
                ))
              }
            </SelectContent>
          </Select>
        </div>
      </FilterSection>

      {/* Advanced Filters (Collapsible) */}
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-center"
        >
          {isExpanded ? 'Hide' : 'Show'} Advanced Filters
        </Button>
        
        {isExpanded && (
          <div className="space-y-6 mt-4">
            <Separator />
            
            {/* Timezone */}
            <FilterSection title="Timezone">
              <Select value={filters.timezone} onValueChange={(value) => updateFilter('timezone', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Any timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace('_', ' ').replace('/', ' / ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterSection>

            {/* Verification */}
            <FilterSection title="Verification">
              <div className="flex items-center justify-between">
                <Label htmlFor="verified" className="text-sm">
                  Verified users only
                </Label>
                <Switch
                  id="verified"
                  checked={filters.verified || false}
                  onCheckedChange={(checked) => updateFilter('verified', checked || undefined)}
                />
              </div>
            </FilterSection>

            {/* Portfolio */}
            <FilterSection title="Portfolio">
              <div className="flex items-center justify-between">
                <Label htmlFor="portfolio" className="text-sm">
                  Has portfolio
                </Label>
                <Switch
                  id="portfolio"
                  checked={filters.hasPortfolio || false}
                  onCheckedChange={(checked) => updateFilter('hasPortfolio', checked || undefined)}
                />
              </div>
            </FilterSection>
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onClearFilters}
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  if (variant === 'modal' || variant === 'inline') {
    return (
      <div className={cn('p-4', className)}>
        {content}
      </div>
    );
  }

  return (
    <Card className={cn('h-fit sticky top-20', className)}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Filter className="w-5 h-5" />
          Filters
          {hasActiveFilters && (
            <Badge variant="secondary" size="sm">
              {Object.keys(filters).filter(key => {
                const value = filters[key as keyof AdvancedSearchFilters];
                if (value === undefined || value === null) return false;
                if (Array.isArray(value)) return value.length > 0;
                if (typeof value === 'string') return value.trim() !== '';
                return true;
              }).length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}
