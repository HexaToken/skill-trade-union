import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Plus, ChevronDown, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { SkillBadge, SkillCategoryBadge } from '@/components/SkillBadge';
import { SuggestSkillModal } from '@/components/SuggestSkillModal';
import { skillsApi } from '@/services/skills-api';
import {
  type Skill,
  type SelectedSkill,
  type SkillPickerProps,
  type SkillCategory,
  SKILL_CATEGORIES,
  SKILL_LEVELS,
} from '@/models/skill-types';

// Level and price selector component
interface SkillConfiguratorProps {
  skill: Skill;
  level?: string;
  price?: number;
  requireLevel: boolean;
  requirePrice: boolean;
  onLevelChange: (level: string) => void;
  onPriceChange: (price: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

function SkillConfigurator({
  skill,
  level,
  price,
  requireLevel,
  requirePrice,
  onLevelChange,
  onPriceChange,
  onConfirm,
  onCancel,
}: SkillConfiguratorProps) {
  const [localLevel, setLocalLevel] = useState(level || '');
  const [localPrice, setLocalPrice] = useState(price?.toString() || '');

  const canConfirm = (!requireLevel || localLevel) && (!requirePrice || localPrice);

  const handleConfirm = () => {
    if (localLevel) onLevelChange(localLevel);
    if (localPrice) onPriceChange(parseInt(localPrice));
    onConfirm();
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="flex items-center gap-2">
        <SkillBadge skill={skill} size="sm" />
        <span className="text-sm font-medium">Configure Skill</span>
      </div>

      {requireLevel && (
        <div className="space-y-2">
          <Label htmlFor="skill-level">Your Level</Label>
          <Select value={localLevel} onValueChange={setLocalLevel}>
            <SelectTrigger id="skill-level">
              <SelectValue placeholder="Select your proficiency level" />
            </SelectTrigger>
            <SelectContent>
              {SKILL_LEVELS.map((skillLevel) => (
                <SelectItem key={skillLevel} value={skillLevel}>
                  {skillLevel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {requirePrice && (
        <div className="space-y-2">
          <Label htmlFor="skill-price">Rate (Credits/Hour)</Label>
          <Input
            id="skill-price"
            type="number"
            min="1"
            max="1000"
            placeholder="e.g., 25"
            value={localPrice}
            onChange={(e) => setLocalPrice(e.target.value)}
          />
        </div>
      )}

      <div className="flex gap-2">
        <Button 
          onClick={handleConfirm} 
          disabled={!canConfirm}
          className="flex-1"
        >
          Add Skill
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

// Main SkillPicker component
export function SkillPicker({
  maxSkills = 10,
  allowCreate = false,
  selectedSkills = [],
  onSkillsChange,
  variant = 'modal',
  placeholder = "Search for skills...",
  categories,
  requireLevel = true,
  requirePrice = false,
  className,
}: SkillPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<SkillCategory | ''>('');
  const [searchResults, setSearchResults] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [configuringSkill, setConfiguringSkill] = useState<Skill | null>(null);
  const [showSuggestModal, setShowSuggestModal] = useState(false);
  const [tempLevel, setTempLevel] = useState<string>('');
  const [tempPrice, setTempPrice] = useState<number | undefined>(undefined);

  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  const debouncedSearch = useCallback(async (query: string, category?: SkillCategory) => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await skillsApi.searchSkills({
          query: query.trim(),
          category: category || undefined,
          status: 'active',
          limit: 20,
        });
        setSearchResults(response.skills);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);
  }, []);

  // Search when query or category changes
  useEffect(() => {
    if (isOpen) {
      debouncedSearch(searchQuery, selectedCategory || undefined);
    }
  }, [searchQuery, selectedCategory, isOpen, debouncedSearch]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Filter categories if provided
  const availableCategories = categories || SKILL_CATEGORIES;

  // Check if skill is already selected
  const isSkillSelected = (skillId: string) => {
    return selectedSkills.some(s => s.skillId === skillId);
  };

  const handleAddSkill = (skill: Skill) => {
    if (isSkillSelected(skill.id) || selectedSkills.length >= maxSkills) {
      return;
    }

    if (requireLevel || requirePrice) {
      setConfiguringSkill(skill);
      setTempLevel('');
      setTempPrice(undefined);
    } else {
      // Add skill directly
      const newSkill: SelectedSkill = {
        skillId: skill.id,
        skill,
        level: 'Beginner',
      };
      onSkillsChange([...selectedSkills, newSkill]);
    }
  };

  const handleConfirmSkill = () => {
    if (!configuringSkill) return;

    const newSkill: SelectedSkill = {
      skillId: configuringSkill.id,
      skill: configuringSkill,
      level: (tempLevel as any) || 'Beginner',
      priceCreditsPerHour: tempPrice,
    };

    onSkillsChange([...selectedSkills, newSkill]);
    setConfiguringSkill(null);
    setSearchQuery('');
  };

  const handleRemoveSkill = (skillId: string) => {
    onSkillsChange(selectedSkills.filter(s => s.skillId !== skillId));
  };

  const handleSuggestSkill = () => {
    setShowSuggestModal(true);
    setIsOpen(false);
  };

  const handleSuggestionSubmit = () => {
    setShowSuggestModal(false);
    setIsOpen(true);
    // Optionally show a toast notification
  };

  // Render selected skills
  const renderSelectedSkills = () => (
    <div className="flex flex-wrap gap-2 mb-3">
      {selectedSkills.map((selectedSkill) => (
        <div key={selectedSkill.skillId} className="flex items-center gap-1">
          <SkillBadge 
            skill={selectedSkill.skill!} 
            size="sm"
            className="pr-1"
          />
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>{selectedSkill.level}</span>
            {selectedSkill.priceCreditsPerHour && (
              <span>• {selectedSkill.priceCreditsPerHour}cr/h</span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-0.5 ml-1"
            onClick={() => handleRemoveSkill(selectedSkill.skillId)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ))}
    </div>
  );

  // Render search results
  const renderSearchResults = () => (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="ml-2 text-sm text-muted-foreground">Searching...</span>
        </div>
      ) : searchResults.length > 0 ? (
        searchResults.map((skill) => (
          <div
            key={skill.id}
            className={cn(
              "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
              isSkillSelected(skill.id) 
                ? "bg-muted border-primary/50 cursor-not-allowed" 
                : "hover:bg-muted/50"
            )}
            onClick={() => !isSkillSelected(skill.id) && handleAddSkill(skill)}
          >
            <div className="flex items-center gap-3">
              <SkillBadge skill={skill} size="sm" />
              <div>
                <div className="text-sm font-medium">{skill.name}</div>
                <div className="text-xs text-muted-foreground">
                  {skill.category} • {skill.subcategories.join(', ')}
                </div>
              </div>
            </div>
            
            {isSkillSelected(skill.id) ? (
              <Badge variant="secondary" className="text-xs">Selected</Badge>
            ) : (
              <Plus className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        ))
      ) : searchQuery.trim() && !isLoading ? (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground mb-3">
            No exact match for "{searchQuery}"
          </p>
          {allowCreate && (
            <Button variant="outline" onClick={handleSuggestSkill}>
              <Plus className="w-4 h-4 mr-2" />
              Suggest a new skill
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );

  // Render category filters
  const renderCategoryFilters = () => (
    <div className="flex flex-wrap gap-2 mb-4">
      <SkillCategoryBadge
        category="All"
        isSelected={!selectedCategory}
        onClick={() => setSelectedCategory('')}
      />
      {availableCategories.map((category) => (
        <SkillCategoryBadge
          key={category}
          category={category}
          isSelected={selectedCategory === category}
          onClick={() => setSelectedCategory(category === selectedCategory ? '' : category)}
        />
      ))}
    </div>
  );

  // Main picker content
  const pickerContent = (
    <div className="space-y-4">
      {/* Selected skills */}
      {selectedSkills.length > 0 && renderSelectedSkills()}

      {/* Category filters */}
      {renderCategoryFilters()}

      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Skill configurator */}
      {configuringSkill && (
        <SkillConfigurator
          skill={configuringSkill}
          level={tempLevel}
          price={tempPrice}
          requireLevel={requireLevel}
          requirePrice={requirePrice}
          onLevelChange={setTempLevel}
          onPriceChange={setTempPrice}
          onConfirm={handleConfirmSkill}
          onCancel={() => setConfiguringSkill(null)}
        />
      )}

      {/* Search results */}
      {!configuringSkill && renderSearchResults()}

      {/* Skill limit indicator */}
      {selectedSkills.length > 0 && (
        <div className="text-xs text-muted-foreground text-center">
          {selectedSkills.length} of {maxSkills} skills selected
        </div>
      )}
    </div>
  );

  // Compact variant (dropdown)
  if (variant === 'compact') {
    return (
      <div className={className}>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span className="truncate">
                {selectedSkills.length > 0 
                  ? `${selectedSkills.length} skill${selectedSkills.length !== 1 ? 's' : ''} selected`
                  : placeholder
                }
              </span>
              <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="start">
            {pickerContent}
          </PopoverContent>
        </Popover>

        <SuggestSkillModal
          isOpen={showSuggestModal}
          onClose={() => setShowSuggestModal(false)}
          onSubmit={handleSuggestionSubmit}
          suggestedName={searchQuery}
        />
      </div>
    );
  }

  // Modal variant
  return (
    <div className={className}>
      <Button variant="outline" onClick={() => setIsOpen(true)}>
        <Plus className="w-4 h-4 mr-2" />
        {selectedSkills.length > 0 
          ? `${selectedSkills.length} skill${selectedSkills.length !== 1 ? 's' : ''} selected`
          : 'Add Skills'
        }
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Select Skills</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto px-1 pb-4">
            {pickerContent}
          </div>
        </DialogContent>
      </Dialog>

      <SuggestSkillModal
        isOpen={showSuggestModal}
        onClose={() => setShowSuggestModal(false)}
        onSubmit={handleSuggestionSubmit}
        suggestedName={searchQuery}
      />
    </div>
  );
}

export default SkillPicker;
