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
  Menu
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
      <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl border-b border-slate-200/20 dark:border-white/06 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-16 items-center justify-between">
            
            {/* Left: Mobile Menu + Logo */}
            <div className="flex items-center gap-4">
              {/* Mobile menu trigger */}
              <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden text-[#06B6D4] hover:bg-[#06B6D4]/10">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 bg-white dark:bg-[#1E293B]">
                  <SheetHeader>
                    <SheetTitle className="text-left">
                      <Link
                        to="/"
                        className="flex items-center gap-3"
                        onClick={() => setShowMobileMenu(false)}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-[#0056D2] to-[#06B6D4] rounded-lg flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <span className="text-xl font-heading font-bold bg-gradient-to-r from-[#0056D2] to-[#06B6D4] bg-clip-text text-transparent">
                          SkillSwap
                        </span>
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="flex flex-col gap-6 py-6">
                    {/* Search in mobile menu */}
                    <div className="relative">
                      <div className="relative flex items-center w-full h-11 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <Search className="absolute left-4 w-5 h-5 text-[#06B6D4]" />
                        <input
                          type="text"
                          placeholder="Search skills, people, or courses…"
                          className="w-full h-full pl-12 pr-4 bg-transparent border-0 focus:ring-0 rounded-full placeholder:text-slate-400 dark:placeholder:text-slate-500"
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
                            className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#0F172A] dark:text-[#F1F5F9] hover:bg-[#0056D2]/10 hover:text-[#0056D2] transition-all duration-200"
                          >
                            <Icon className="w-5 h-5" />
                            {item.label}
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Mobile user section */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-auto">
                      <div className="flex items-center gap-3 mb-4">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                          <AvatarFallback className="bg-[#0056D2]/10 text-[#0056D2] font-medium">
                            {currentUser.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">{currentUser.name}</p>
                          <div className="flex items-center gap-1">
                            <Wallet className="w-3 h-3 text-[#06B6D4]" />
                            <span className="text-sm font-medium text-[#06B6D4]">
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
                className="flex items-center gap-3 hover:scale-105 transition-transform duration-200"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-[#0056D2] to-[#06B6D4] rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <span className="text-xl lg:text-2xl font-heading font-bold bg-gradient-to-r from-[#0056D2] to-[#06B6D4] bg-clip-text text-transparent">
                  SkillSwap
                </span>
              </Link>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative">
              <div className="relative w-full">
                <div className={cn(
                  "relative flex items-center w-full h-11 rounded-full transition-all duration-200 border",
                  "bg-white dark:bg-[#1E293B]",
                  isSearchFocused || showSuggestions
                    ? "border-[#0056D2] shadow-lg shadow-[#0056D2]/10"
                    : "border-slate-200 dark:border-white/08 hover:border-slate-300 dark:hover:border-white/12"
                )}>
                  <Search className="absolute left-4 w-5 h-5 text-[#06B6D4]" />
                  <Input
                    ref={searchRef}
                    type="text"
                    placeholder="Search skills, people, or courses…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                      // Delay hiding suggestions to allow clicking
                      setTimeout(() => {
                        setIsSearchFocused(false);
                        setShowSuggestions(false);
                      }, 150);
                    }}
                    onKeyDown={handleKeyDown}
                    className="w-full h-full pl-12 pr-12 bg-transparent border-0 focus:ring-0 rounded-full placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    aria-label="Global Search"
                    autoComplete="off"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && (isSearchFocused || selectedIndex >= 0) && (
                  <div 
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#1E293B] border border-slate-200 dark:border-white/08 rounded-xl shadow-2xl z-50 max-h-96 overflow-hidden animate-fade-in"
                    role="listbox"
                  >
                    <div className="p-2">
                      {/* People Section */}
                      {peopleResults.length > 0 && (
                        <div className="mb-4">
                          <div className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
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
                                    ? "bg-[#0056D2]/6 dark:bg-[#06B6D4]/15"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                )}
                                role="option"
                                aria-selected={selectedIndex === globalIndex}
                              >
                                <Avatar className="w-10 h-10 ring-2 ring-white dark:ring-slate-700">
                                  <AvatarImage src={person.avatar} alt={person.name} />
                                  <AvatarFallback className="bg-[#0056D2]/10 text-[#0056D2] font-medium">
                                    {person.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium text-[#0F172A] dark:text-[#F1F5F9] truncate">
                                      {person.name}
                                    </p>
                                    {person.verified && (
                                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    )}
                                  </div>
                                  <p className="text-sm text-[#334155] dark:text-[#E2E8F0]">
                                    {person.skill}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-[#06B6D4]">
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
                          <div className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
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
                                    ? "bg-[#0056D2]/6 dark:bg-[#06B6D4]/15"
                                    : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                                )}
                                role="option"
                                aria-selected={selectedIndex === globalIndex}
                              >
                                <div className="w-14 h-10 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                                  <img 
                                    src={course.thumbnail} 
                                    alt={course.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-[#0F172A] dark:text-[#F1F5F9] truncate">
                                    {course.name}
                                  </p>
                                  <p className="text-sm text-[#334155] dark:text-[#E2E8F0]">
                                    by {course.instructor}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-[#06B6D4]">
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
                          className="w-full p-3 text-center text-[#0056D2] hover:bg-[#0056D2]/5 rounded-lg transition-colors font-medium"
                        >
                          View all results for "{searchQuery}"
                        </button>
                      )}

                      {/* Empty State */}
                      {suggestions.length === 0 && searchQuery.length >= 2 && (
                        <div className="p-6 text-center">
                          <p className="text-[#334155] dark:text-[#E2E8F0] mb-1">
                            No matches found for "{searchQuery}"
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Try another keyword or browse categories
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 ml-8">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  className="text-[#334155] dark:text-[#E2E8F0] hover:text-[#0056D2] hover:bg-[#0056D2]/10 transition-all duration-200"
                  asChild
                >
                  <Link to={item.href}>
                    {item.label}
                  </Link>
                </Button>
              ))}
            </nav>

            {/* Right: Quick Links */}
            <div className="flex items-center gap-2">
              {/* Add Skill Offer (Desktop) */}
              <Button 
                variant="outline" 
                size="sm"
                className="hidden lg:flex border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white transition-all duration-200"
                asChild
              >
                <Link to="/create">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Skill Offer
                </Link>
              </Button>

              {/* Search Icon (Tablet) */}
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex lg:hidden text-[#06B6D4] hover:bg-[#06B6D4]/10"
                onClick={() => setShowMobileSearch(true)}
              >
                <Search className="w-5 h-5" />
                <span className="sr-only">Search</span>
              </Button>

              {/* Messages */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative text-[#06B6D4] hover:bg-[#06B6D4]/10 rounded-xl transition-all duration-200" 
                asChild
              >
                <Link to="/messages">
                  <MessageCircle className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white">
                    3
                  </Badge>
                  <span className="sr-only">Messages</span>
                </Link>
              </Button>

              {/* Credits Balance */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[#06B6D4] hover:bg-[#06B6D4]/10 rounded-xl transition-all duration-200" 
                asChild
              >
                <Link to="/wallet" className="flex items-center gap-2">
                  <Wallet className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">
                    {currentUser.wallet.credits.toLocaleString()}
                  </span>
                </Link>
              </Button>

              {/* Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                      <AvatarFallback className="bg-[#0056D2]/10 text-[#0056D2] font-medium">
                        {currentUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Open user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-white dark:bg-[#1E293B] border-slate-200 dark:border-white/08 shadow-xl"
                >
                  <div className="px-2 py-1.5">
                    <p className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">{currentUser.name}</p>
                    <p className="text-sm text-[#334155] dark:text-[#E2E8F0]">{currentUser.location.city}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <Wallet className="w-3 h-3 text-[#06B6D4]" />
                      <span className="text-sm font-medium text-[#06B6D4]">
                        {currentUser.wallet.credits.toLocaleString()} credits
                      </span>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <Award className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/sessions">
                      <Zap className="mr-2 h-4 w-4" />
                      My Sessions
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link to="/classes">
                      <Award className="mr-2 h-4 w-4" />
                      My Courses
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem className="p-0">
                    <OfflineTradeButton
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start font-normal text-sm h-8"
                      showIcon={true}
                    />
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Search Overlay */}
      <Dialog open={showMobileSearch} onOpenChange={setShowMobileSearch}>
        <DialogContent className="sm:max-w-none w-full h-full max-h-none p-0 bg-[#0F172A]/95 backdrop-blur-xl border-0">
          <div className="flex flex-col h-full">
            {/* Search Header */}
            <div className="flex items-center gap-4 p-4 border-b border-white/08">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileSearch(false)}
                className="text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
              
              <div className="flex-1 relative">
                <div className="relative flex items-center w-full h-11 rounded-full bg-[#1E293B] border border-white/08">
                  <Search className="absolute left-4 w-5 h-5 text-[#06B6D4]" />
                  <Input
                    type="text"
                    placeholder="Search skills, people, or courses…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-full pl-12 pr-12 bg-transparent border-0 focus:ring-0 rounded-full text-white placeholder:text-slate-400"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-4 p-1 hover:bg-slate-700 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Suggestions */}
            <div className="flex-1 overflow-y-auto p-4">
              {peopleResults.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
                    People
                  </h3>
                  <div className="space-y-2">
                    {peopleResults.map((person) => (
                      <button
                        key={person.id}
                        onClick={() => handleSuggestionClick(person)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#1E293B]/50 hover:bg-[#1E293B] transition-colors text-left"
                      >
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={person.avatar} alt={person.name} />
                          <AvatarFallback className="bg-[#0056D2]/20 text-[#06B6D4]">
                            {person.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-white truncate">
                              {person.name}
                            </p>
                            {person.verified && (
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                            )}
                          </div>
                          <p className="text-sm text-slate-300">{person.skill}</p>
                          <p className="text-sm text-[#06B6D4] font-medium">
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
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-3">
                    Courses
                  </h3>
                  <div className="space-y-2">
                    {courseResults.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => handleSuggestionClick(course)}
                        className="w-full flex items-center gap-3 p-3 rounded-lg bg-[#1E293B]/50 hover:bg-[#1E293B] transition-colors text-left"
                      >
                        <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-700">
                          <img 
                            src={course.thumbnail} 
                            alt={course.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-white truncate mb-1">
                            {course.name}
                          </p>
                          <p className="text-sm text-slate-300">by {course.instructor}</p>
                          <p className="text-sm text-[#06B6D4] font-medium">
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
                  <p className="text-slate-300 mb-2">
                    No matches found for "{searchQuery}"
                  </p>
                  <p className="text-sm text-slate-400">
                    Try another keyword or browse categories
                  </p>
                </div>
              )}

              {searchQuery.length > 0 && suggestions.length > 0 && (
                <Button
                  onClick={handleSearch}
                  className="w-full bg-[#0056D2] hover:bg-[#004BB8] text-white mt-4"
                >
                  View all results for "{searchQuery}"
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
