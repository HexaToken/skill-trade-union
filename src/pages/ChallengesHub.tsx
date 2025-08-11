import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { 
  Trophy, 
  Users, 
  Clock, 
  Zap, 
  Calendar,
  ChevronRight,
  Filter,
  Star,
  Award,
  Target
} from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import { cn } from '@/lib/utils';

// Types
interface Sprint {
  id: string;
  slug: string;
  title: string;
  theme: string;
  status: 'active' | 'upcoming' | 'past';
  startsAt: string;
  endsAt: string;
  blurb: string;
  participants: number;
  metrics: {
    sessions: number;
    hours: number;
  };
  rewards: {
    participation: number;
    first: number;
    second: number;
    third: number;
  };
  backgroundImage?: string;
  category: string;
}

interface Filters {
  category: string[];
  status: string;
  sort: string;
}

// Mock data
const mockSprints: Sprint[] = [
  {
    id: 'spr_web_design_week',
    slug: 'web-design-week',
    title: 'Web Design Week',
    theme: 'Design',
    status: 'active',
    startsAt: '2025-01-13T00:00:00Z',
    endsAt: '2025-01-20T23:59:59Z',
    blurb: 'Master modern web design fundamentals in 7 intensive days of learning and teaching.',
    participants: 1240,
    metrics: { sessions: 3821, hours: 6210 },
    rewards: { participation: 10, first: 100, second: 50, third: 25 },
    backgroundImage: 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&h=400&fit=crop',
    category: 'Design'
  },
  {
    id: 'spr_react_mastery',
    slug: 'react-mastery',
    title: 'React Mastery Sprint',
    theme: 'Development',
    status: 'upcoming',
    startsAt: '2025-01-27T00:00:00Z',
    endsAt: '2025-02-03T23:59:59Z',
    blurb: 'Build your React skills from hooks to advanced patterns in one focused week.',
    participants: 0,
    metrics: { sessions: 0, hours: 0 },
    rewards: { participation: 15, first: 150, second: 75, third: 35 },
    backgroundImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    category: 'Development'
  },
  {
    id: 'spr_spanish_immersion',
    slug: 'spanish-immersion',
    title: 'Spanish Immersion Week',
    theme: 'Language',
    status: 'upcoming',
    startsAt: '2025-02-10T00:00:00Z',
    endsAt: '2025-02-17T23:59:59Z',
    blurb: 'Dive deep into conversational Spanish with native speakers and fellow learners.',
    participants: 0,
    metrics: { sessions: 0, hours: 0 },
    rewards: { participation: 10, first: 100, second: 50, third: 25 },
    backgroundImage: 'https://images.unsplash.com/photo-1543342384-d4eaeb1b4e1d?w=800&h=400&fit=crop',
    category: 'Language'
  },
  {
    id: 'spr_business_fundamentals',
    slug: 'business-fundamentals-past',
    title: 'Business Fundamentals',
    theme: 'Business',
    status: 'past',
    startsAt: '2024-12-30T00:00:00Z',
    endsAt: '2025-01-06T23:59:59Z',
    blurb: 'Learn essential business skills from strategy to execution.',
    participants: 890,
    metrics: { sessions: 2100, hours: 3400 },
    rewards: { participation: 10, first: 100, second: 50, third: 25 },
    backgroundImage: 'https://images.unsplash.com/photo-1664575602554-2087b04935a5?w=800&h=400&fit=crop',
    category: 'Business'
  }
];

const CATEGORIES = ['All', 'Design', 'Development', 'Language', 'Business', 'Marketing', 'Music'];

const getThemeColor = (theme: string) => {
  const colors = {
    Design: 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800',
    Development: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
    Language: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
    Business: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
    Marketing: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
    Music: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800'
  };
  return colors[theme as keyof typeof colors] || colors.Design;
};

const ChallengesHub = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>({
    category: [],
    status: 'all',
    sort: 'participants'
  });

  const filteredSprints = useMemo(() => {
    let filtered = mockSprints;

    if (filters.status !== 'all') {
      filtered = filtered.filter(sprint => sprint.status === filters.status);
    }

    if (filters.category.length > 0 && !filters.category.includes('All')) {
      filtered = filtered.filter(sprint => filters.category.includes(sprint.category));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case 'starting-soon':
          return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
        case 'newest':
          return new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime();
        case 'participants':
        default:
          return b.participants - a.participants;
      }
    });

    return filtered;
  }, [filters]);

  const activeSprint = mockSprints.find(s => s.status === 'active');
  const upcomingSprints = mockSprints.filter(s => s.status === 'upcoming');
  const pastSprints = mockSprints.filter(s => s.status === 'past');

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A]">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#0056D2] to-[#06B6D4] text-white">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-heading font-bold mb-6">
              Skill Sprint Challenges
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-8">
              Teach or learn as much as you can in 7 days. Earn badges and bonus credits.
            </p>
            {activeSprint && (
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-[#0056D2] hover:bg-gray-100 font-semibold text-lg px-8 py-4"
                onClick={() => navigate(`/challenges/${activeSprint.slug}`)}
              >
                <Zap className="mr-2 h-5 w-5" />
                View This Week's Sprint
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters Section */}
        <div className="glass-card border-[#0056D2]/10 mb-8">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-[#0056D2]" />
              <h2 className="text-lg font-heading font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Filter Challenges</h2>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">Status</Label>
                  <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger className="w-40 bg-white border-[#0056D2]/20 focus:border-[#0056D2] focus:ring-[#0056D2] text-[#0F172A]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sprints</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8]">Sort by</Label>
                  <Select value={filters.sort} onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}>
                    <SelectTrigger className="w-48 border-[#0056D2]/20 focus:border-[#0056D2] focus:ring-[#0056D2]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="participants">Most Participants</SelectItem>
                      <SelectItem value="starting-soon">Starting Soon</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="w-full lg:w-auto">
                <Label className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] mb-2 block">Categories</Label>
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category}
                      size="sm"
                      onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          category: prev.category.includes(category)
                            ? prev.category.filter(c => c !== category)
                            : [...prev.category, category]
                        }));
                      }}
                      className={cn(
                        'text-xs font-medium transition-all duration-200 border',
                        filters.category.includes(category)
                          ? 'bg-[#0056D2] hover:bg-[#004BB8] text-white border-[#0056D2] shadow-sm'
                          : 'bg-white text-[#0056D2] border-[#0056D2]/30 hover:bg-[#0056D2]/10 hover:border-[#0056D2]/50'
                      )}
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Active Sprint */}
        {activeSprint && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold bg-gradient-to-r from-[#0056D2] to-[#06B6D4] bg-clip-text text-transparent">
                  Featured Sprint
                </h2>
                <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Top-rated challenge of the week</p>
              </div>
            </div>
            <SprintCardFeatured sprint={activeSprint} />
          </div>
        )}

        {/* Sprint Grid */}
        <Tabs value={filters.status === 'all' ? 'all' : filters.status} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-[#0056D2]/5 border border-[#0056D2]/20">
            <TabsTrigger value="all" className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white font-medium">All Sprints</TabsTrigger>
            <TabsTrigger value="active" className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white font-medium">Active</TabsTrigger>
            <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white font-medium">Upcoming</TabsTrigger>
            <TabsTrigger value="past" className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white font-medium">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-8">
            <SprintGrid sprints={filteredSprints} />
          </TabsContent>

          <TabsContent value="active" className="space-y-8">
            <SprintGrid sprints={filteredSprints.filter(s => s.status === 'active')} />
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-8">
            <SprintGrid sprints={filteredSprints.filter(s => s.status === 'upcoming')} />
          </TabsContent>

          <TabsContent value="past" className="space-y-8">
            <SprintGrid sprints={filteredSprints.filter(s => s.status === 'past')} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Featured Sprint Card Component
const SprintCardFeatured: React.FC<{ sprint: Sprint }> = ({ sprint }) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-[#0056D2]/20">
      <div className="relative">
        {sprint.backgroundImage && (
          <div 
            className="h-64 bg-cover bg-center relative"
            style={{ backgroundImage: `url(${sprint.backgroundImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
          </div>
        )}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <Badge className={getThemeColor(sprint.theme)}>
            {sprint.theme}
          </Badge>
          <CountdownTimer
            endAt={sprint.endsAt}
            size="md"
            variant="pill"
            className="text-white bg-black/50 backdrop-blur-sm border-white/20"
          />
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-2xl font-heading font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
          {sprint.title}
        </h3>
        <p className="text-[#64748B] dark:text-[#94A3B8] mb-4">
          {sprint.blurb}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0056D2]">
              {sprint.participants.toLocaleString()}
            </div>
            <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Participants</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#06B6D4]">
              {sprint.metrics.sessions.toLocaleString()}
            </div>
            <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Sessions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              +{sprint.rewards.participation}
            </div>
            <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Bonus Credits</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            className="flex-1 bg-[#0056D2] hover:bg-[#004BB8] text-white font-semibold"
            onClick={() => navigate(`/challenges/${sprint.slug}`)}
          >
            Join Sprint
          </Button>
          <Button
            variant="outline"
            className="text-[#06B6D4] border-[#06B6D4]/30 hover:bg-[#06B6D4]/10"
            onClick={() => navigate(`/challenges/${sprint.slug}?tab=leaderboard`)}
          >
            Leaderboard
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#64748B] hover:text-[#0056D2]"
            onClick={() => navigate(`/challenges/${sprint.slug}?tab=rules`)}
          >
            Rules
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Sprint Grid Component
const SprintGrid: React.FC<{ sprints: Sprint[] }> = ({ sprints }) => {
  if (sprints.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-[#0056D2]/10 to-[#06B6D4]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="h-10 w-10 text-[#0056D2]" />
        </div>
        <h3 className="text-2xl font-heading font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-3">
          No sprints match your filters
        </h3>
        <p className="text-[#64748B] dark:text-[#94A3B8] mb-6 max-w-md mx-auto">
          Try adjusting your filters or check back later for new challenges.
        </p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="text-[#0056D2] border-[#0056D2]/30 hover:bg-[#0056D2]/10 font-medium"
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {sprints.map((sprint) => (
        <SprintCard key={sprint.id} sprint={sprint} />
      ))}
    </div>
  );
};

// Regular Sprint Card Component
const SprintCard: React.FC<{ sprint: Sprint }> = ({ sprint }) => {
  const navigate = useNavigate();

  const getStatusBadge = () => {
    const badgeProps = {
      active: { variant: 'default' as const, className: 'bg-green-100 text-green-700 border-green-200' },
      upcoming: { variant: 'secondary' as const, className: 'bg-blue-100 text-blue-700 border-blue-200' },
      past: { variant: 'outline' as const, className: 'bg-gray-100 text-gray-700 border-gray-200' }
    };
    
    const props = badgeProps[sprint.status];
    return (
      <Badge {...props}>
        {sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-[#0056D2]/10 h-full">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <Badge className={getThemeColor(sprint.theme)}>
            {sprint.theme}
          </Badge>
          {getStatusBadge()}
        </div>

        <h3 className="text-lg font-heading font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2 line-clamp-2">
          {sprint.title}
        </h3>
        
        <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-4 line-clamp-2 flex-1">
          {sprint.blurb}
        </p>

        {sprint.status === 'active' && (
          <div className="mb-4">
            <CountdownTimer endAt={sprint.endsAt} size="sm" />
          </div>
        )}

        {sprint.status === 'upcoming' && (
          <div className="mb-4 text-sm text-[#64748B] dark:text-[#94A3B8]">
            <Calendar className="h-4 w-4 inline mr-1" />
            Starts {new Date(sprint.startsAt).toLocaleDateString()}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-4 text-center">
          <div>
            <div className="text-lg font-bold text-[#0056D2]">
              {sprint.participants}
            </div>
            <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Participants</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">
              +{sprint.rewards.first}
            </div>
            <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Top Prize</div>
          </div>
        </div>

        <div className="flex gap-2 mt-auto">
          {sprint.status === 'past' ? (
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-[#06B6D4] border-[#06B6D4]/30 hover:bg-[#06B6D4]/10"
              onClick={() => navigate(`/challenges/${sprint.slug}?tab=leaderboard`)}
            >
              <Award className="h-4 w-4 mr-1" />
              View Winners
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                className="flex-1 bg-[#0056D2] hover:bg-[#004BB8] text-white"
                onClick={() => navigate(`/challenges/${sprint.slug}`)}
              >
                {sprint.status === 'active' ? 'Join' : 'Learn More'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#64748B] hover:text-[#0056D2]"
                onClick={() => navigate(`/challenges/${sprint.slug}?tab=rules`)}
              >
                Rules
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ChallengesHub;
