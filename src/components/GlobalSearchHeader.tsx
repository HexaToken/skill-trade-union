import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  X,
  MessageCircle,
  Wallet,
  User,
  Settings,
  LogOut,
  Bell,
  Plus,
  Award,
  CheckCircle,
  Zap,
  Users,
  BookOpen,
  Target,
  Map,
  Heart,
  Menu,
  Moon,
  Sun
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import CreditBalancePill from '@/components/CreditBalancePill';
import CreditWalletModal from '@/components/CreditWalletModal';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { currentUser, users } from '@/data/mockData';
import { courses } from '@/mock/enhanced-data';
import OfflineTradeButton from './OfflineTradeButton';

interface SearchSuggestion {
  type: 'person' | 'course';
  id: string;
  name: string;
  avatar?: string;
  thumbnail?: string;
  skill?: string;
  instructor?: string;
  credits: number;
  verified?: boolean;
}

export default function GlobalSearchHeader() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [showCreditWallet, setShowCreditWallet] = useState(false);

  const navItems = [
    { label: 'Find a Match', href: '/matches', icon: Users },
    { label: 'Classes', href: '/classes', icon: BookOpen },
    { label: 'Mentors', href: '/mentors', icon: Award },
    { label: 'Profile Demo', href: '/mentor/marcus-chen', icon: User },
    { label: 'Challenges', href: '/challenges', icon: Target },
    { label: 'Skill Sprints', href: '/skill-sprints', icon: Zap },
    { label: 'Map', href: '/map', icon: Map },
    { label: 'Donate', href: '/donate', icon: Heart },
  ];
  
  const navigate = useNavigate();
  const searchRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Theme toggle function
  const toggleTheme = () => {
    const currentTheme = document.documentElement.dataset.theme;
    document.documentElement.dataset.theme = currentTheme === 'dark' ? 'light' : 'dark';
  };

  // Generate search suggestions
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const newSuggestions: SearchSuggestion[] = [];

    // Search people
    users.forEach(user => {
      if (
        user.name.toLowerCase().includes(query) ||
        user.skillsOffered.some(skill => skill.skillId.toLowerCase().includes(query))
      ) {
        const primarySkill = user.skillsOffered[0];
        newSuggestions.push({
          type: 'person',
          id: user.id,
          name: user.name,
          avatar: user.avatarUrl,
          skill: primarySkill?.skillId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
          credits: 15, // Base rate for demo
          verified: user.verification?.idVerified || false
        });
      }
    });

    // Search courses
    courses.forEach(course => {
      if (
        course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.subtitle?.toLowerCase().includes(query)
      ) {
        newSuggestions.push({
          type: 'course',
          id: course.id,
          name: course.title,
          thumbnail: course.thumbnailUrl,
          instructor: users.find(u => u.id === course.teacherId)?.name || 'Unknown',
          credits: course.pricePerSeat
        });
      }
    });

    setSuggestions(newSuggestions.slice(0, 8)); // Limit to 8 suggestions
    setShowSuggestions(newSuggestions.length > 0);
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (searchQuery.trim()) {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        searchRef.current?.blur();
        break;
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setShowMobileSearch(false);
      searchRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'person') {
      navigate(`/mentor/${suggestion.id}`);
    } else {
      // Generate slug from course title
      const slug = suggestion.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      navigate(`/classes/${slug}`);
    }
    setShowSuggestions(false);
    setShowMobileSearch(false);
    setSearchQuery('');
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedIndex(-1);
    searchRef.current?.focus();
  };

  const peopleResults = suggestions.filter(s => s.type === 'person');
  const courseResults = suggestions.filter(s => s.type === 'course');

  return (
    <>
      {/* Main Header */}
      <header className="sticky top-0 z-40 backdrop-blur bg-surface/95 border-b border-border shadow-sm">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          
          {/* Left: Mobile Menu + Logo */}
          <div className="flex items-center gap-2">
            {/* Mobile menu trigger */}
            <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Link
                      to="/"
                      className="flex items-center gap-3"
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <div className="h-6 w-6 rounded-md bg-brand-gradient"></div>
                      <span className="text-ink-head font-semibold">SkillSwap</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col gap-6 py-6">
                  {/* Search in mobile menu */}
                  <div className="relative">
                    <div className="relative flex items-center w-full h-10 rounded-pill bg-elevated/40 border border-border px-3">
                      <Search className="w-5 h-5 text-secondary" />
                      <input
                        type="text"
                        placeholder="Search skills, mentors, or courses…"
                        className="w-full h-full pl-3 bg-transparent border-0 focus:ring-0 text-sm text-ink-body placeholder:text-ink-body/50 focus:outline-none"
                        onClick={() => {
                          setShowMobileMenu(false);
                          setShowMobileSearch(true);
                        }}
                      />
                    </div>
                  </div>

                  {/* Navigation */}
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setShowMobileMenu(false)}
                          className="flex items-center gap-3 px-3 py-3 rounded-xl text-ink-body hover:text-ink-head transition-all duration-200"
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>

                  {/* Mobile user section */}
                  <div className="border-t border-border pt-6 mt-auto">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                        <AvatarFallback>
                          {currentUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-ink-head">{currentUser.name}</p>
                        <div className="flex items-center gap-1">
                          <Wallet className="w-3 h-3 text-secondary" />
                          <span className="text-sm font-medium text-secondary">
                            {currentUser.wallet.credits.toLocaleString()} credits
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/wallet" onClick={() => setShowMobileMenu(false)}>
                          <Wallet className="w-4 h-4 mr-2" />
                          Wallet
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/messages" onClick={() => setShowMobileMenu(false)}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Messages
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2"
            >
              <div className="h-6 w-6 rounded-md bg-brand-gradient"></div>
              <span className="text-ink-head font-semibold">SkillSwap</span>
            </Link>
          </div>

          {/* Center: Global search (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-xl mx-6">
            <div className="flex items-center gap-2 w-full bg-elevated/40 border border-border rounded-pill px-3 h-10">
              <Search className="text-ink-body/60 w-5 h-5" />
              <input 
                ref={searchRef}
                className="bg-transparent flex-1 text-sm text-ink-body placeholder:text-ink-body/50 focus:outline-none"
                placeholder="Search skills, mentors, or courses…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => {
                  setTimeout(() => {
                    setIsSearchFocused(false);
                    setShowSuggestions(false);
                  }, 150);
                }}
                onKeyDown={handleKeyDown}
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="p-1 hover:bg-elevated/60 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-ink-body/60" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (isSearchFocused || selectedIndex >= 0) && (
              <div 
                ref={suggestionsRef}
                className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-card shadow-md z-50 max-h-96 overflow-hidden"
              >
                <div className="p-2">
                  {/* People Section */}
                  {peopleResults.length > 0 && (
                    <div className="mb-4">
                      <div className="px-3 py-2 text-xs font-medium text-ink-body/60 uppercase tracking-wider">
                        People
                      </div>
                      {peopleResults.map((person, index) => {
                        const globalIndex = index;
                        return (
                          <button
                            key={person.id}
                            onClick={() => handleSuggestionClick(person)}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                              selectedIndex === globalIndex
                                ? "bg-primary/10"
                                : "hover:bg-elevated/60"
                            )}
                          >
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={person.avatar} alt={person.name} />
                              <AvatarFallback>
                                {person.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-ink-head truncate">
                                  {person.name}
                                </p>
                                {person.verified && (
                                  <CheckCircle className="w-4 h-4 text-success" />
                                )}
                              </div>
                              <p className="text-sm text-ink-body">
                                {person.skill}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-secondary">
                                {person.credits} credits/hr
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Courses Section */}
                  {courseResults.length > 0 && (
                    <div className="mb-2">
                      <div className="px-3 py-2 text-xs font-medium text-ink-body/60 uppercase tracking-wider">
                        Courses
                      </div>
                      {courseResults.map((course, index) => {
                        const globalIndex = peopleResults.length + index;
                        return (
                          <button
                            key={course.id}
                            onClick={() => handleSuggestionClick(course)}
                            className={cn(
                              "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                              selectedIndex === globalIndex
                                ? "bg-primary/10"
                                : "hover:bg-elevated/60"
                            )}
                          >
                            <div className="w-14 h-10 rounded-lg overflow-hidden bg-elevated">
                              <img 
                                src={course.thumbnail} 
                                alt={course.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-ink-head truncate">
                                {course.name}
                              </p>
                              <p className="text-sm text-ink-body">
                                by {course.instructor}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-secondary">
                                {course.credits} credits
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* View All Results */}
                  {suggestions.length > 0 && (
                    <button
                      onClick={handleSearch}
                      className="w-full p-3 text-center text-primary hover:bg-primary/5 rounded-lg transition-colors font-medium"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  )}

                  {/* Empty State */}
                  {suggestions.length === 0 && searchQuery.length >= 2 && (
                    <div className="p-6 text-center">
                      <p className="text-ink-body mb-1">
                        No matches found for "{searchQuery}"
                      </p>
                      <p className="text-sm text-ink-body/60">
                        Try another keyword or browse categories
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions */}
          <nav className="flex items-center gap-3">
            <Link to="/matches" className="text-ink-body hover:text-ink-head">Find a Match</Link>
            <Link to="/classes" className="text-ink-body hover:text-ink-head">Classes</Link>
            <Link to="/mentors" className="text-ink-body hover:text-ink-head">Mentors</Link>
            <Link to="/challenges" className="text-ink-body hover:text-ink-head">Challenges</Link>
            <Link to="/map" className="text-ink-body hover:text-ink-head">Map</Link>
            <Link to="/donate" className="text-ink-body hover:text-ink-head">Donate</Link>

            {/* Credit pill */}
            <CreditBalancePill
              balance={currentUser.wallet.credits}
              onClick={() => setShowCreditWallet(true)}
            />

            {/* CTA */}
            <Link
              to="/login"
              className="ml-2 inline-flex items-center rounded-pill h-9 px-4 text-sm text-white"
              style={{ background: 'var(--primary)' }}
            >
              Sign in
            </Link>

            {/* Theme toggle */}
            <button 
              onClick={toggleTheme}
              aria-label="Toggle theme" 
              className="ml-1 text-ink-body hover:text-ink-head"
            >
              🌓
            </button>
          </nav>
        </div>
        {/* Subtle futuristic accent line */}
        <div className="h-[2px] w-full bg-brand-gradient"></div>
      </header>

      {/* Mobile Search Overlay */}
      <Dialog open={showMobileSearch} onOpenChange={setShowMobileSearch}>
        <DialogContent className="sm:max-w-none w-full h-full max-h-none p-0 bg-canvas/95 backdrop-blur-xl border-0">
          <div className="flex flex-col h-full">
            {/* Search Header */}
            <div className="flex items-center gap-4 p-4 border-b border-border">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileSearch(false)}
                className="text-ink-head hover:bg-elevated/60"
              >
                <X className="w-5 h-5" />
              </Button>
              
              <div className="flex-1 relative">
                <div className="relative flex items-center w-full h-11 rounded-pill bg-elevated border border-border">
                  <Search className="absolute left-4 w-5 h-5 text-secondary" />
                  <Input
                    type="text"
                    placeholder="Search skills, people, or courses…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-full pl-12 pr-12 bg-transparent border-0 focus:ring-0 rounded-pill text-ink-head placeholder:text-ink-body/50"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 p-1 hover:bg-elevated/60 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-ink-body/60" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Suggestions */}
            <div className="flex-1 overflow-y-auto p-4">
              {peopleResults.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-ink-body/60 uppercase tracking-wider mb-3">
                    People
                  </h3>
                  <div className="space-y-2">
                    {peopleResults.map((person) => (
                      <button
                        key={person.id}
                        onClick={() => handleSuggestionClick(person)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-elevated/50 hover:bg-elevated transition-colors text-left"
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={person.avatar} alt={person.name} />
                          <AvatarFallback>
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-ink-head truncate">
                              {person.name}
                            </p>
                            {person.verified && (
                              <CheckCircle className="w-4 h-4 text-success" />
                            )}
                          </div>
                          <p className="text-sm text-ink-body">{person.skill}</p>
                          <p className="text-sm text-secondary font-medium">
                            {person.credits} credits/hr
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {courseResults.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-ink-body/60 uppercase tracking-wider mb-3">
                    Courses
                  </h3>
                  <div className="space-y-2">
                    {courseResults.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => handleSuggestionClick(course)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-elevated/50 hover:bg-elevated transition-colors text-left"
                      >
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-elevated">
                          <img 
                            src={course.thumbnail} 
                            alt={course.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-ink-head truncate mb-1">
                            {course.name}
                          </p>
                          <p className="text-sm text-ink-body">by {course.instructor}</p>
                          <p className="text-sm text-secondary font-medium">
                            {course.credits} credits
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {suggestions.length === 0 && searchQuery.length >= 2 && (
                <div className="text-center py-12">
                  <p className="text-ink-body mb-2">
                    No matches found for "{searchQuery}"
                  </p>
                  <p className="text-sm text-ink-body/60">
                    Try another keyword or browse categories
                  </p>
                </div>
              )}

              {searchQuery.length > 0 && suggestions.length > 0 && (
                <Button
                  onClick={handleSearch}
                  style={{ background: 'var(--color-primary)' }}
                  className="w-full text-white mt-4"
                >
                  View all results for "{searchQuery}"
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credit Wallet Modal */}
      <CreditWalletModal
        open={showCreditWallet}
        onClose={() => setShowCreditWallet(false)}
      />
    </>
  );
}
