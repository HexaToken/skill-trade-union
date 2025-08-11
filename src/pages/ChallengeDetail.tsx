import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Trophy, 
  Users, 
  Clock, 
  Zap, 
  Calendar,
  Target,
  Award,
  Info,
  BookOpen,
  MessageSquare,
  Play,
  CheckCircle,
  Star,
  Flame,
  Globe,
  MapPin,
  TrendingUp,
  Gift,
  Shield,
  HelpCircle
} from 'lucide-react';
import CountdownTimer from '@/components/CountdownTimer';
import JoinSprintCard from '@/components/JoinSprintCard';
import LeaderboardTable from '@/components/LeaderboardTable';
import ProgressWidget from '@/components/ProgressWidget';
import BookingModalUnified from '@/components/BookingModalUnified';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

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
  description: string;
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
  category: string;
  rules: string[];
  scoring: { action: string; points: number }[];
  badges: { name: string; description: string; icon: string }[];
}

interface LeaderboardItem {
  rank: number;
  user: {
    id: string;
    name: string;
    avatar: string;
    country: string;
  };
  value: number;
  streak?: number;
  delta?: number;
  lastActive?: string;
}

interface ActivityItem {
  id: string;
  text: string;
  timestamp: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  points: number;
}

interface UserProgress {
  points: number;
  rank: number;
  goal: number;
  current: number;
  streakDays: boolean[];
  isJoined: boolean;
}

// Mock data
const mockSprint: Sprint = {
  id: 'spr_web_design_week',
  slug: 'web-design-week',
  title: 'Web Design Week',
  theme: 'Design',
  status: 'active',
  startsAt: '2025-01-13T00:00:00Z',
  endsAt: '2025-01-20T23:59:59Z',
  blurb: 'Master modern web design fundamentals in 7 intensive days of learning and teaching.',
  description: 'Join fellow designers and developers in an intensive week-long sprint focused on modern web design. Whether you\'re teaching your expertise or learning new skills, this challenge will push you to achieve more in 7 days than most do in a month.',
  participants: 1240,
  metrics: { sessions: 3821, hours: 6210 },
  rewards: { participation: 10, first: 100, second: 50, third: 25 },
  category: 'Design',
  rules: [
    'Sessions must be at least 30 minutes to count toward points',
    'Both mentor and learner must confirm session completion',
    'Fair play rules apply - no fake sessions or point manipulation',
    'Participants must maintain respectful communication',
    'Disputes will be reviewed by moderators within 24 hours'
  ],
  scoring: [
    { action: 'Teaching session completed', points: 10 },
    { action: 'Learning hour completed', points: 5 },
    { action: '5-star review received', points: 2 },
    { action: 'Daily streak bonus', points: 3 },
    { action: 'Group session bonus', points: 5 }
  ],
  badges: [
    { name: '3-Day Streak', description: 'Complete sessions for 3 consecutive days', icon: '🔥' },
    { name: 'Top 10%', description: 'Finish in the top 10% of participants', icon: '⭐' },
    { name: 'Mentor Master', description: 'Complete 10+ teaching sessions', icon: '👨‍🏫' },
    { name: 'Learning Machine', description: 'Complete 20+ learning hours', icon: '📚' },
    { name: 'Community Helper', description: 'Receive 25+ five-star reviews', icon: '❤️' }
  ]
};

const mockLeaderboard: LeaderboardItem[] = [
  {
    rank: 1,
    user: { id: 'u1', name: 'Ava Ramirez', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b056a692?w=80&h=80&fit=crop&crop=face', country: 'CA' },
    value: 18,
    streak: 5,
    delta: 3,
    lastActive: '2 hours ago'
  },
  {
    rank: 2,
    user: { id: 'u2', name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', country: 'US' },
    value: 16,
    streak: 4,
    delta: 1,
    lastActive: '4 hours ago'
  },
  {
    rank: 3,
    user: { id: 'u3', name: 'Sofia Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face', country: 'ES' },
    value: 14,
    streak: 3,
    delta: -1,
    lastActive: '1 hour ago'
  }
];

const mockActivity: ActivityItem[] = [
  {
    id: 'a1',
    text: 'finished "Logo Design 101" (Learner)',
    timestamp: '2025-01-14T14:22:00Z',
    user: { name: 'Ava Ramirez', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b056a692?w=40&h=40&fit=crop&crop=face' },
    action: 'learning',
    points: 5
  },
  {
    id: 'a2',
    text: 'taught "Brand Sprint Workshop" (Mentor)',
    timestamp: '2025-01-14T13:55:00Z',
    user: { name: 'Marcus Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face' },
    action: 'teaching',
    points: 10
  },
  {
    id: 'a3',
    text: 'completed "UI Design Principles" (Learner)',
    timestamp: '2025-01-14T12:30:00Z',
    user: { name: 'Sofia Rodriguez', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face' },
    action: 'learning',
    points: 5
  }
];

const mockUserProgress: UserProgress = {
  points: 42,
  rank: 27,
  goal: 50,
  current: 8,
  streakDays: [true, true, false, true, true, false, false],
  isJoined: true
};

const ChallengeDetail = () => {
  const { sprintSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [userProgress, setUserProgress] = useState<UserProgress>(mockUserProgress);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [leaderboardMetric, setLeaderboardMetric] = useState<'teachingSessions' | 'learningHours' | 'avgRating' | 'skillsCompleted'>('teachingSessions');

  // In real app, fetch sprint data based on sprintSlug
  const sprint = mockSprint;

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'leaderboard', 'progress', 'rules', 'activity'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleJoinSprint = async (data: { roles: ('mentor' | 'learner')[]; timeWindows: string[]; onlineOnly: boolean }) => {
    // Mock join logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUserProgress(prev => ({ ...prev, isJoined: true }));
  };

  const getThemeColor = (theme: string) => {
    const colors = {
      Design: 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800',
      Development: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
      Language: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
      Business: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800'
    };
    return colors[theme as keyof typeof colors] || colors.Design;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A]">
      {/* Header Band */}
      <div className="border-b bg-gradient-to-r from-[#0056D2]/5 to-[#06B6D4]/5">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge className={getThemeColor(sprint.theme)}>
                  {sprint.theme}
                </Badge>
                {sprint.status === 'active' && (
                  <CountdownTimer endAt={sprint.endsAt} size="sm" variant="pill" />
                )}
                {sprint.status === 'past' && (
                  <Badge variant="outline" className="text-gray-600">
                    Ended on {new Date(sprint.endsAt).toLocaleDateString()}
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl lg:text-4xl font-heading font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
                {sprint.title}
              </h1>
              <p className="text-[#64748B] dark:text-[#94A3B8]">
                Week-long sprint • Join as Mentor, Learner or Both
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center lg:text-right">
              <div>
                <div className="text-2xl font-bold text-[#0056D2]">
                  {sprint.participants.toLocaleString()}
                </div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Participants</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#06B6D4]">
                  {sprint.metrics.sessions.toLocaleString()}
                </div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Sessions</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {sprint.metrics.hours.toLocaleString()}
                </div>
                <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">Hours</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Subnav */}
      <div className="sticky top-0 z-40 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-5 h-12 bg-[#F8FAFC] dark:bg-[#1E293B]">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
              <TabsTrigger value="leaderboard" className="text-xs sm:text-sm">Leaderboard</TabsTrigger>
              <TabsTrigger value="progress" className="text-xs sm:text-sm">My Progress</TabsTrigger>
              <TabsTrigger value="rules" className="text-xs sm:text-sm">Rules & Rewards</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs sm:text-sm">Activity</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* What's this sprint */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                      <Info className="h-5 w-5 text-[#0056D2]" />
                      What's this sprint?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                      {sprint.description}
                    </p>
                  </CardContent>
                </Card>

                {/* How to participate */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                      <BookOpen className="h-5 w-5 text-[#0056D2]" />
                      How to participate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 bg-[#0056D2] text-white rounded-full flex items-center justify-center font-bold">1</div>
                        <div>
                          <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Join as Mentor/Learner/Both</h4>
                          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Choose your role and set your availability preferences</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 bg-[#06B6D4] text-white rounded-full flex items-center justify-center font-bold">2</div>
                        <div>
                          <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Book or log sessions in the sprint category</h4>
                          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Sessions must be at least 30 minutes and related to {sprint.theme.toLowerCase()}</p>
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                        <div>
                          <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Earn points, climb the board, win bonus credits</h4>
                          <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">Track your progress and compete with other participants</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick tips */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                      <Target className="h-5 w-5 text-[#0056D2]" />
                      Quick tips for success
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-[#64748B] dark:text-[#94A3B8]">
                      <li className="flex items-start gap-2">
                        <Flame className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <span>Maintain daily streaks for bonus points</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Star className="h-4 w-4 text-[#0056D2] mt-0.5 flex-shrink-0" />
                        <span>Receive 5-star reviews to earn extra credits</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Users className="h-4 w-4 text-[#06B6D4] mt-0.5 flex-shrink-0" />
                        <span>Group sessions provide bonus points</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Join Panel */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <JoinSprintCard
                    sprintTitle={sprint.title}
                    sprintId={sprint.id}
                    isJoined={userProgress.isJoined}
                    onJoin={handleJoinSprint}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            {sprint.status === 'past' && (
              <LeaderboardTable
                metric="teachingSessions"
                items={mockLeaderboard}
                showWinners={true}
                currentUserId="u2"
              />
            )}

            <div className="flex flex-wrap gap-4 mb-6">
              <Button
                variant={leaderboardMetric === 'teachingSessions' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLeaderboardMetric('teachingSessions')}
                className={leaderboardMetric === 'teachingSessions' ? 'bg-[#0056D2] hover:bg-[#004BB8]' : ''}
              >
                Teaching Sessions
              </Button>
              <Button
                variant={leaderboardMetric === 'learningHours' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLeaderboardMetric('learningHours')}
                className={leaderboardMetric === 'learningHours' ? 'bg-[#0056D2] hover:bg-[#004BB8]' : ''}
              >
                Learning Hours
              </Button>
              <Button
                variant={leaderboardMetric === 'avgRating' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setLeaderboardMetric('avgRating')}
                className={leaderboardMetric === 'avgRating' ? 'bg-[#0056D2] hover:bg-[#004BB8]' : ''}
              >
                Avg Rating
              </Button>
            </div>

            <LeaderboardTable
              metric={leaderboardMetric}
              items={mockLeaderboard}
              currentUserId="u2"
            />
          </TabsContent>

          {/* My Progress Tab */}
          <TabsContent value="progress" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <ProgressWidget
                  goal={userProgress.goal}
                  current={userProgress.current}
                  points={userProgress.points}
                  rank={userProgress.rank}
                  delta={3}
                  streakDays={userProgress.streakDays}
                />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                      <Zap className="h-5 w-5 text-[#0056D2]" />
                      Log Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      className="w-full bg-[#0056D2] hover:bg-[#004BB8] text-white"
                      onClick={() => setShowBookingModal(true)}
                    >
                      Book a Session
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-[#06B6D4] border-[#06B6D4]/30 hover:bg-[#06B6D4]/10"
                    >
                      Log Offline Session
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Badges Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                  <Award className="h-5 w-5 text-[#0056D2]" />
                  Badges you can earn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sprint.badges.map((badge, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-[#0056D2]/10 hover:bg-[#0056D2]/5 transition-colors">
                      <div className="text-2xl">{badge.icon}</div>
                      <div>
                        <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{badge.name}</h4>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rules & Rewards Tab */}
          <TabsContent value="rules" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Rules */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                      <Shield className="h-5 w-5 text-[#0056D2]" />
                      Sprint Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {sprint.rules.map((rule, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Scoring */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                      <Target className="h-5 w-5 text-[#0056D2]" />
                      Scoring System
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {sprint.scoring.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-[#0056D2]/10 last:border-b-0">
                          <span className="text-sm text-[#64748B] dark:text-[#94A3B8]">{item.action}</span>
                          <Badge className="bg-[#0056D2]/10 text-[#0056D2] border-[#0056D2]/20">
                            +{item.points} pts
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Rewards */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                      <Gift className="h-5 w-5 text-[#0056D2]" />
                      Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-4 bg-gradient-to-r from-[#0056D2]/5 to-[#06B6D4]/5 rounded-lg">
                      <Trophy className="h-8 w-8 text-[#0056D2] mx-auto mb-2" />
                      <h4 className="font-bold text-[#0F172A] dark:text-[#F1F5F9]">Participation Reward</h4>
                      <p className="text-2xl font-bold text-[#0056D2]">+{sprint.rewards.participation} credits</p>
                      <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Complete ≥3 sessions</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">Category Winners</h4>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-3 bg-[#0056D2]/10 dark:bg-[#0056D2]/20 rounded-lg border border-[#0056D2]/20 dark:border-[#0056D2]/30">
                          <div className="text-2xl mb-1">🥇</div>
                          <div className="font-bold text-[#0056D2] dark:text-[#0056D2]">+{sprint.rewards.first}</div>
                          <div className="text-xs text-[#0056D2]/80 dark:text-[#0056D2]/80">1st Place</div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="text-2xl mb-1">🥈</div>
                          <div className="font-bold text-gray-700 dark:text-gray-300">+{sprint.rewards.second}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">2nd Place</div>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <div className="text-2xl mb-1">🥉</div>
                          <div className="font-bold text-amber-700 dark:text-amber-300">+{sprint.rewards.third}</div>
                          <div className="text-xs text-amber-600 dark:text-amber-400">3rd Place</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* FAQ */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                      <HelpCircle className="h-5 w-5 text-[#0056D2]" />
                      FAQ
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      <AccordionItem value="refunds">
                        <AccordionTrigger className="text-sm">Can I get a refund if I don't complete the sprint?</AccordionTrigger>
                        <AccordionContent className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                          Participation is free, but any credits spent on sessions follow our standard refund policy.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="disputes">
                        <AccordionTrigger className="text-sm">What happens if there's a session dispute?</AccordionTrigger>
                        <AccordionContent className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                          All disputes are reviewed by our moderation team within 24 hours. Fair play is our priority.
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="offline">
                        <AccordionTrigger className="text-sm">Can I log offline sessions?</AccordionTrigger>
                        <AccordionContent className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                          Yes, but both parties must confirm the session details for it to count toward the sprint.
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0F172A] dark:text-[#F1F5F9]">
                  <MessageSquare className="h-5 w-5 text-[#0056D2]" />
                  Live Activity Feed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#0056D2]/5 transition-colors">
                      <img 
                        src={activity.user.avatar} 
                        alt={activity.user.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[#64748B] dark:text-[#94A3B8]">
                          <span className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">{activity.user.name}</span>
                          {' '}{activity.text}
                          <Badge className="ml-2 bg-green-100 text-green-700 border-green-200 text-xs">
                            +{activity.points} pts
                          </Badge>
                        </p>
                        <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <BookingModalUnified
          mode="mentor"
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
        />
      )}
    </div>
  );
};

export default ChallengeDetail;
