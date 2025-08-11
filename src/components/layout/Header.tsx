import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Menu, 
  X, 
  MessageCircle, 
  Wallet,
  User,
  Settings,
  LogOut,
  Bell,
  Map,
  Heart,
  Award,
  Users,
  BookOpen,
  Target
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/ThemeToggle';
import { CreditDisplay } from '@/components/CreditDisplay';
import { cn } from '@/lib/utils';
import { currentUser } from '@/data/mockData';

export default function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Find a Match', href: '/matches', icon: Users },
    { label: 'Classes', href: '/classes', icon: BookOpen },
    { label: 'Mentors', href: '/mentors', icon: Award },
    { label: 'Profile Demo', href: '/profile/marcus-chen', icon: User },
    { label: 'Challenges', href: '/challenges', icon: Target },
    { label: 'Map', href: '/map', icon: Map },
    { label: 'Donate', href: '/donate', icon: Heart },
  ];

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 glass-header backdrop-blur-xl bg-white/95 dark:bg-slate-900/95 transition-all duration-300">
      <div className="page-container">
        <div className="flex h-16 items-center justify-between">
          {/* Left section - Logo and nav */}
          <div className="flex items-center gap-6">
            {/* Mobile menu trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <div className="flex flex-col gap-6 py-6">
                  {/* Logo */}
                  <Link 
                    to="/" 
                    className="flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-2xl font-heading font-bold text-gradient">
                      SkillSwap
                    </span>
                  </Link>
                  
                  {/* Search */}
                  <form onSubmit={handleSearch}>
                    <Input 
                      name="search"
                      placeholder="Search skills, people, classes..." 
                      className="w-full"
                    />
                  </form>
                  
                  {/* Navigation */}
                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl text-foreground hover:bg-educational-blue/10 hover:text-educational-blue transition-all duration-200 hover:shadow-md"
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                  
                  {/* Mobile user section */}
                  <div className="border-t pt-6 mt-auto">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                        <AvatarFallback>
                          {currentUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{currentUser.name}</p>
                        <CreditDisplay amount={currentUser.wallet.credits} size="sm" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/wallet" onClick={() => setIsMobileMenuOpen(false)}>
                          <Wallet className="w-4 h-4 mr-2" />
                          Wallet
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to="/messages" onClick={() => setIsMobileMenuOpen(false)}>
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
            <Link to="/" className="flex items-center gap-3 hover-scale">
              <div className="w-8 h-8 bg-gradient-to-br from-educational-blue to-educational-cyan rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl md:text-2xl font-heading font-bold text-gradient">
                SkillSwap
              </span>
            </Link>
            
            {/* Tagline */}
            <Badge
              variant="secondary"
              className="hidden sm:inline-flex bg-gradient-to-r from-educational-blue/10 to-educational-cyan/10 text-educational-blue border-educational-blue/20 hover:border-educational-cyan/30 transition-colors"
            >
              Trade skills, not cash
            </Badge>
          </div>

          {/* Center section - Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search skills, people, or classes..."
                  className={cn(
                    "w-full pl-10 pr-4 transition-all duration-200 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl",
                    isSearchFocused && "ring-2 ring-educational-blue ring-offset-2 border-educational-blue"
                  )}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </form>
          </div>

          {/* Right section - Navigation and user */}
          <div className="flex items-center gap-2">
            {/* Desktop navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  className="hover-scale"
                  asChild
                >
                  <Link to={item.href}>
                    {item.label}
                  </Link>
                </Button>
              ))}
            </nav>

            {/* Wallet mini */}
            <Button variant="ghost" size="sm" className="hover-scale text-educational-cyan hover:text-educational-cyan/80 hover:bg-educational-cyan/10 rounded-xl transition-all duration-200" asChild>
              <Link to="/wallet" className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="hidden sm:inline font-medium">
                  {currentUser.wallet.credits.toLocaleString()}
                </span>
              </Link>
            </Button>

            {/* Messages */}
            <Button variant="ghost" size="sm" className="hover-scale relative text-educational-cyan hover:text-educational-cyan/80 hover:bg-educational-cyan/10 rounded-xl transition-all duration-200" asChild>
              <Link to="/messages">
                <MessageCircle className="h-4 w-4" />
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-brand-red text-white"
                >
                  3
                </Badge>
                <span className="sr-only">Messages</span>
              </Link>
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="sm" className="hover-scale relative text-educational-cyan hover:text-educational-cyan/80 hover:bg-educational-cyan/10 rounded-xl transition-all duration-200">
              <Bell className="h-4 w-4" />
              <Badge
                className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-brand-red text-white"
              >
                2
              </Badge>
              <span className="sr-only">Notifications</span>
            </Button>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover-scale hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                    <AvatarFallback>
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 glass-card border-slate-200 dark:border-slate-700 shadow-xl">
                <div className="px-2 py-1.5">
                  <p className="font-medium">{currentUser.name}</p>
                  <p className="text-sm text-muted-foreground">{currentUser.location.city}</p>
                  <div className="mt-1">
                    <CreditDisplay amount={currentUser.wallet.credits} size="sm" />
                  </div>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link to={`/profile/${currentUser.id}`}>
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">
                    <Award className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
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
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
