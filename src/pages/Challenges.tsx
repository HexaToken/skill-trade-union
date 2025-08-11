import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  Calendar, 
  Clock, 
  Target, 
  Award, 
  Star, 
  TrendingUp,
  Filter,
  Medal,
  Crown,
  Flag,
  PlayCircle,
  CheckCircle,
  Timer,
  Gift,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CreditDisplay } from '@/components/CreditDisplay';
import { challenges, users } from '@/data/mockData';

// Extended mock challenges
const allChallenges = [
  ...challenges,
  {
    id: 'challenge-3',
    title: 'Spanish Speaking Marathon',
    description: 'Practice Spanish conversation for 30 days straight with different community members',
    goal: 'Complete 30 conversation sessions',
    startAt: '2024-02-01T00:00:00Z',
    endAt: '2024-03-02T23:59:59Z',
    rules: 'Minimum 15 minutes per session, different partner each day preferred',
    rewardCredits: 300,
    status: 'upcoming' as const,
    participants: 156,
    leaderboard: [],
    category: 'Languages',
    maxParticipants: 500
  },
  {
    id: 'challenge-4',
    title: 'Photography Skills Showcase',
    description: 'Share one new photography technique or tip every week for 8 weeks',
    goal: 'Document 8 different photography techniques',
    startAt: '2024-01-20T00:00:00Z',
    endAt: '2024-03-16T23:59:59Z',
    rules: 'Original content only, include before/after examples',
    rewardCredits: 250,
    status: 'active' as const,
    participants: 89,
    leaderboard: [
      { userId: 'user-1', points: 850, rank: 1 },
      { userId: 'user-3', points: 720, rank: 2 },
      { userId: 'user-4', points: 680, rank: 3 }
    ],
    category: 'Creative'
  },
  {
    id: 'challenge-5',
    title: 'Cooking Around the World',
    description: 'Learn and teach recipes from 12 different countries',
    goal: 'Master recipes from 12 different cuisines',
    startAt: '2024-01-10T00:00:00Z',
    endAt: '2024-02-15T23:59:59Z',
    rules: 'Video demonstration required, must share recipe and cultural background',
    rewardCredits: 400,
    status: 'ended' as const,
    participants: 234,
    leaderboard: [
      { userId: 'user-4', points: 1200, rank: 1 },
      { userId: 'user-2', points: 1100, rank: 2 },
      { userId: 'user-1', points: 980, rank: 3 }
    ],
    category: 'Lifestyle'
  }
];

const categories = ['All', 'Technology', 'Design', 'Languages', 'Creative', 'Lifestyle', 'Business'];
const statusFilters = ['All', 'Active', 'Upcoming', 'Ended'];

export default function Challenges() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeTab, setActiveTab] = useState('browse');

  const filteredChallenges = allChallenges.filter(challenge => {
    const categoryMatch = selectedCategory === 'All' || challenge.category === selectedCategory;
    const statusMatch = selectedStatus === 'All' || 
      (selectedStatus === 'Active' && challenge.status === 'active') ||
      (selectedStatus === 'Upcoming' && challenge.status === 'upcoming') ||
      (selectedStatus === 'Ended' && challenge.status === 'ended');
    
    return categoryMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ended': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <PlayCircle className="w-4 h-4" />;
      case 'upcoming': return <Timer className="w-4 h-4" />;
      case 'ended': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatTimeRemaining = (endDate: string) => {
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  const myParticipations = allChallenges.filter(c => 
    c.status === 'active' && Math.random() > 0.5 // Mock participation
  );

  const upcomingChallenges = allChallenges.filter(c => c.status === 'upcoming');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="page-container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold">Community Challenges</h1>
              <p className="text-muted-foreground text-lg">
                Join skill-building challenges and compete with the community
              </p>
            </div>
            
            <Button onClick={() => navigate('/matches')}>
              <Target className="w-4 h-4 mr-2" />
              Create Challenge
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {[
              { label: 'Active Challenges', value: '12', icon: PlayCircle },
              { label: 'Total Participants', value: '1,247', icon: Users },
              { label: 'Credits Awarded', value: '50K+', icon: Gift },
              { label: 'Completion Rate', value: '78%', icon: TrendingUp }
            ].map((stat) => {
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
        </div>
      </div>

      <div className="page-container py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="browse">Browse All</TabsTrigger>
            <TabsTrigger value="my-challenges">My Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboards</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'All' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusFilters.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === 'All' ? 'All Status' : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="text-sm text-muted-foreground flex items-center">
                {filteredChallenges.length} challenges found
              </div>
            </div>

            {/* Featured Challenge */}
            {filteredChallenges.length > 0 && (
              <Card className="bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 border-brand-primary/20">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-brand-amber" />
                    <Badge className="bg-brand-amber text-white">Featured</Badge>
                  </div>
                  <CardTitle className="text-xl">{filteredChallenges[0].title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{filteredChallenges[0].description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-brand-primary" />
                      <span><CreditDisplay amount={filteredChallenges[0].rewardCredits} size="sm" /> reward</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-primary" />
                      <span>{filteredChallenges[0].participants} joined</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-primary" />
                      <span>{formatTimeRemaining(filteredChallenges[0].endAt)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-brand-primary" />
                      <span>{filteredChallenges[0].category}</span>
                    </div>
                  </div>

                  <Button className="bg-gradient-to-r from-brand-primary to-brand-secondary">
                    Join Challenge
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Challenge Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.slice(1).map((challenge) => (
                <Card key={challenge.id} className="hover-lift transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <Badge 
                          variant="outline" 
                          className={cn('text-xs', getStatusColor(challenge.status))}
                        >
                          {getStatusIcon(challenge.status)}
                          <span className="ml-1 capitalize">{challenge.status}</span>
                        </Badge>
                        <CardTitle className="text-lg line-clamp-2">{challenge.title}</CardTitle>
                      </div>
                      <div className="text-center">
                        <CreditDisplay amount={challenge.rewardCredits} size="sm" />
                        <p className="text-xs text-muted-foreground">reward</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {challenge.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Participants</span>
                        <span>{challenge.participants} / {challenge.maxParticipants || '∞'}</span>
                      </div>
                      {challenge.maxParticipants && (
                        <Progress 
                          value={(challenge.participants / challenge.maxParticipants) * 100} 
                          className="h-1" 
                        />
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatTimeRemaining(challenge.endAt)}</span>
                      <Badge variant="outline" size="sm">{challenge.category}</Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => console.log('View details:', challenge.id)}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        disabled={challenge.status === 'ended'}
                        onClick={() => console.log('Join challenge:', challenge.id)}
                      >
                        {challenge.status === 'ended' ? 'Ended' : 'Join'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-challenges" className="space-y-6">
            <div className="grid gap-6">
              {/* Active Participations */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Active Challenges</h3>
                {myParticipations.length > 0 ? (
                  <div className="grid gap-4">
                    {myParticipations.map((challenge) => (
                      <Card key={challenge.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <h4 className="font-semibold">{challenge.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>{formatTimeRemaining(challenge.endAt)}</span>
                                <span>Rank: #42</span>
                                <span>Progress: 65%</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Progress value={65} className="w-32 h-2 mb-2" />
                              <Button size="sm">Continue</Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Target className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No active challenges</h3>
                      <p className="text-muted-foreground mb-4">
                        Join a challenge to start building your skills and earning rewards
                      </p>
                      <Button onClick={() => setActiveTab('browse')}>
                        Browse Challenges
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Upcoming */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Registered Upcoming</h3>
                <div className="grid gap-4">
                  {upcomingChallenges.slice(0, 2).map((challenge) => (
                    <Card key={challenge.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <h4 className="font-semibold">{challenge.title}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>Starts: {new Date(challenge.startAt).toLocaleDateString()}</span>
                              <span>{challenge.participants} participants</span>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Add to Calendar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-6">
            <div className="grid gap-6">
              {allChallenges.filter(c => c.leaderboard.length > 0).map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5 text-brand-amber" />
                        {challenge.title}
                      </CardTitle>
                      <Badge variant="outline" className={getStatusColor(challenge.status)}>
                        {challenge.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {challenge.leaderboard.map((entry, index) => {
                        const user = users.find(u => u.id === entry.userId);
                        const rankIcon = index === 0 ? Crown : index === 1 ? Medal : Award;
                        const RankIcon = rankIcon;
                        
                        return (
                          <div key={entry.userId} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                'w-8 h-8 rounded-full flex items-center justify-center',
                                index === 0 ? 'bg-brand-secondary/10 text-brand-secondary' :
                                index === 1 ? 'bg-gray-100 text-gray-600' :
                                index === 2 ? 'bg-orange-100 text-orange-600' :
                                'bg-muted text-muted-foreground'
                              )}>
                                <RankIcon className="w-4 h-4" />
                              </div>
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                                <AvatarFallback>
                                  {user?.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user?.name}</p>
                                <p className="text-sm text-muted-foreground">Rank #{entry.rank}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{entry.points} points</p>
                              {index === 0 && (
                                <div className="flex items-center gap-1 text-xs text-brand-amber">
                                  <Star className="w-3 h-3 fill-current" />
                                  <span>Champion</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
