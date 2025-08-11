import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trophy, 
  Users, 
  Clock, 
  Zap, 
  Target,
  Award,
  Star,
  TrendingUp,
  Calendar,
  Play,
  CheckCircle,
  Crown,
  Medal,
  Flame,
  Share2,
  MapPin,
  ChevronRight,
  X,
  Timer,
  BarChart3,
  Sparkles,
  Gift
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Types for sprint data
interface SprintData {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  participants: number;
  totalSessions: number;
  topSkill: string;
  isActive: boolean;
}

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  mainSkill: string;
  stat: number;
  statType: string;
  badge?: 'gold' | 'silver' | 'bronze';
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  criteria: string;
}

interface UserProgress {
  goalProgress: number;
  streakDays: number;
  totalDays: number;
  teachingSessions: number;
  learningSessions: number;
  hasJoined: boolean;
}

const SkillSprintPage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    goalProgress: 65,
    streakDays: 4,
    totalDays: 7,
    teachingSessions: 8,
    learningSessions: 5,
    hasJoined: true
  });
  const [joinForm, setJoinForm] = useState({
    role: '',
    skills: [] as string[],
    agreeToTerms: false
  });

  // Mock data
  const currentSprint: SprintData = {
    id: 'sprint-2025-w3',
    title: 'Web Design Week',
    description: 'Master modern web design principles, from UI/UX fundamentals to advanced prototyping techniques. Connect with designers and developers worldwide.',
    startDate: '2025-01-14T00:00:00Z',
    endDate: '2025-01-20T23:59:59Z',
    participants: 1847,
    totalSessions: 3521,
    topSkill: 'Figma Design',
    isActive: true
  };

  const leaderboardData = {
    teaching: [
      { rank: 1, userId: 'u1', name: 'Sarah Chen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b056a692?w=150', mainSkill: 'UI Design', stat: 15, statType: 'sessions', badge: 'gold' as const },
      { rank: 2, userId: 'u2', name: 'Marcus Lopez', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', mainSkill: 'Figma', stat: 12, statType: 'sessions', badge: 'silver' as const },
      { rank: 3, userId: 'u3', name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', mainSkill: 'Prototyping', stat: 10, statType: 'sessions', badge: 'bronze' as const },
      { rank: 4, userId: 'u4', name: 'David Kim', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', mainSkill: 'UX Research', stat: 8, statType: 'sessions' },
      { rank: 5, userId: 'u5', name: 'Lisa Rodriguez', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', mainSkill: 'Design Systems', stat: 7, statType: 'sessions' }
    ],
    learning: [
      { rank: 1, userId: 'l1', name: 'Alex Thompson', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', mainSkill: 'Web Design', stat: 28, statType: 'hours', badge: 'gold' as const },
      { rank: 2, userId: 'l2', name: 'Maria Santos', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', mainSkill: 'Figma', stat: 25, statType: 'hours', badge: 'silver' as const },
      { rank: 3, userId: 'l3', name: 'James Park', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', mainSkill: 'UI/UX', stat: 22, statType: 'hours', badge: 'bronze' as const }
    ],
    skills: [
      { rank: 1, userId: 's1', name: 'Taylor Green', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b056a692?w=150', mainSkill: 'Full Stack', stat: 6, statType: 'skills completed', badge: 'gold' as const },
      { rank: 2, userId: 's2', name: 'Jordan Lee', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', mainSkill: 'Design Tools', stat: 5, statType: 'skills completed', badge: 'silver' as const }
    ],
    rating: [
      { rank: 1, userId: 'r1', name: 'Rachel Foster', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', mainSkill: 'Mentoring', stat: 4.95, statType: '★ avg rating', badge: 'gold' as const },
      { rank: 2, userId: 'r2', name: 'Daniel Wright', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', mainSkill: 'Teaching', stat: 4.92, statType: '★ avg rating', badge: 'silver' as const }
    ]
  };

  const badges: Badge[] = [
    { id: 'champion', name: 'Sprint Champion', description: '1st place in any category', icon: '👑', earned: false, criteria: 'Top the leaderboard' },
    { id: 'builder', name: 'Community Builder', description: 'Top 10% contributor', icon: '🏗️', earned: true, criteria: 'Be in top 10%' },
    { id: 'consistent', name: 'Consistent Learner', description: '5+ sessions in a week', icon: '📚', earned: true, criteria: '5+ sessions weekly' },
    { id: 'first', name: 'First Sprint', description: 'Completed your first sprint', icon: '🎯', earned: false, criteria: 'Complete a sprint' },
    { id: 'mentor', name: 'Super Mentor', description: 'Taught 10+ sessions', icon: '🧑‍🏫', earned: true, criteria: '10+ teaching sessions' },
    { id: 'social', name: 'Social Butterfly', description: 'Connected with 20+ people', icon: '🦋', earned: false, criteria: 'Connect with 20+ people' }
  ];

  const pastChampions = [
    { name: 'Alex Chen', sprint: 'Python Week', badge: 'Teaching Champion', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { name: 'Sofia Rodriguez', sprint: 'Guitar Mastery', badge: 'Learning Champion', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b056a692?w=150' },
    { name: 'Marcus Kim', sprint: 'Data Science', badge: 'Community Builder', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150' }
  ];

  // Countdown timer effect
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(currentSprint.endDate).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [currentSprint.endDate]);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2: return <Medal className="h-4 w-4 text-gray-400" />;
      case 3: return <Award className="h-4 w-4 text-amber-600" />;
      default: return <span className="text-sm font-bold text-[#64748B]">#{rank}</span>;
    }
  };

  const handleJoinSprint = () => {
    if (!joinForm.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the Sprint Rules to continue.",
        variant: "destructive"
      });
      return;
    }

    if (!joinForm.role) {
      toast({
        title: "Role Required", 
        description: "Please select your participation role.",
        variant: "destructive"
      });
      return;
    }

    setUserProgress(prev => ({ ...prev, hasJoined: true }));
    setShowJoinModal(false);
    toast({
      title: "Welcome to the Sprint!",
      description: `You've joined as a ${joinForm.role}. Let's start learning and teaching!`,
    });
  };

  const shareProgress = () => {
    toast({
      title: "Progress Shared!",
      description: "Your sprint progress has been shared on social media.",
    });
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] dark:bg-[#0F172A]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0056D2] via-[#0056D2] to-[#06B6D4]">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className={"absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"}></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 font-heading">
              Join a Skill Sprint Challenge
            </h1>
            <p className="text-lg lg:text-xl text-white/85 mb-8 leading-relaxed">
              Compete, learn, and share your skills in time-limited challenges. Earn bonus credits, climb the leaderboard, and make global connections.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[#0056D2] hover:bg-white/90 font-bold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                onClick={() => !userProgress.hasJoined ? setShowJoinModal(true) : navigate('#current-sprint')}
              >
                <Zap className="h-5 w-5 mr-2" />
                {userProgress.hasJoined ? "View My Progress" : "Join This Week's Sprint"}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-4 rounded-xl backdrop-blur-sm"
                onClick={() => navigate('#hall-of-fame')}
              >
                <Trophy className="h-5 w-5 mr-2" />
                View Past Winners
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 space-y-12">
        {/* Current Sprint Overview */}
        <section id="current-sprint" className="scroll-mt-8">
          <Card className="border-[#0056D2]/20 bg-gradient-to-r from-white to-[#0056D2]/5 dark:from-[#1E293B] dark:to-[#0056D2]/10">
            <CardHeader>
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl lg:text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
                    {currentSprint.title}
                  </CardTitle>
                  <p className="text-[#64748B] dark:text-[#94A3B8]">
                    {new Date(currentSprint.startDate).toLocaleDateString()} – {new Date(currentSprint.endDate).toLocaleDateString()}
                  </p>
                </div>
                
                {/* Countdown Timer */}
                <div className="bg-white dark:bg-[#0F172A] rounded-xl p-4 border-2 border-[#0056D2]/20">
                  <div className="text-center">
                    <div className="text-sm font-medium text-[#64748B] dark:text-[#94A3B8] mb-1">Time Remaining</div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-[#0056D2]">
                      <div className="flex flex-col items-center">
                        <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                        <span className="text-xs text-[#64748B]">HRS</span>
                      </div>
                      <span className="text-[#64748B]">:</span>
                      <div className="flex flex-col items-center">
                        <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                        <span className="text-xs text-[#64748B]">MIN</span>
                      </div>
                      <span className="text-[#64748B]">:</span>
                      <div className="flex flex-col items-center">
                        <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                        <span className="text-xs text-[#64748B]">SEC</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-[#64748B] dark:text-[#94A3B8] mb-6 leading-relaxed">
                {currentSprint.description}
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-[#0056D2]/5 dark:bg-[#0056D2]/10 rounded-lg">
                  <div className="text-2xl font-bold text-[#0056D2]">{currentSprint.participants.toLocaleString()}</div>
                  <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">Active Participants</div>
                </div>
                <div className="text-center p-4 bg-[#06B6D4]/5 dark:bg-[#06B6D4]/10 rounded-lg">
                  <div className="text-2xl font-bold text-[#06B6D4]">{currentSprint.totalSessions.toLocaleString()}</div>
                  <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">Sessions Logged</div>
                </div>
                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-emerald-600">{currentSprint.topSkill}</div>
                  <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">Top Skill Taught</div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!userProgress.hasJoined ? (
                  <Button 
                    onClick={() => setShowJoinModal(true)}
                    className="bg-[#0056D2] hover:bg-[#004BB8] text-white font-semibold"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Join Sprint
                  </Button>
                ) : (
                  <Button 
                    onClick={() => navigate('#progress')}
                    className="bg-[#06B6D4] hover:bg-[#0891B2] text-white font-semibold"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View My Progress
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={() => navigate('#leaderboard')}
                  className="border-[#0056D2]/30 text-[#0056D2] hover:bg-[#0056D2]/10"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  View Leaderboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-3xl font-bold text-center text-[#0F172A] dark:text-[#F1F5F9] mb-8 font-heading">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                step: 1, 
                title: 'Join', 
                description: 'Sign up for the challenge and set your role (Mentor, Learner, Both).', 
                icon: Users,
                color: 'from-[#0056D2] to-[#004BB8]'
              },
              { 
                step: 2, 
                title: 'Participate', 
                description: 'Complete as many teaching/learning sessions as you can in 7 days.', 
                icon: Zap,
                color: 'from-[#06B6D4] to-[#0891B2]'
              },
              { 
                step: 3, 
                title: 'Earn Rewards', 
                description: 'Get bonus credits, badges, and leaderboard glory.', 
                icon: Trophy,
                color: 'from-emerald-500 to-emerald-600'
              }
            ].map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center`}>
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-3">
                    {item.step}. {item.title}
                  </h3>
                  <p className="text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Personal Progress Tracker */}
        {userProgress.hasJoined && (
          <section id="progress" className="scroll-mt-8">
            <Card className="border-[#06B6D4]/20 bg-gradient-to-r from-[#06B6D4]/5 to-[#06B6D4]/10">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#0F172A] dark:text-[#F1F5F9] flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-[#06B6D4]" />
                  Your Sprint Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#06B6D4] mb-1">{userProgress.goalProgress}%</div>
                    <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">Goal Progress</div>
                    <Progress value={userProgress.goalProgress} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-[#0056D2] mb-1">
                      Day {userProgress.streakDays}/{userProgress.totalDays}
                    </div>
                    <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">Active Streak</div>
                    <div className="flex justify-center mt-2">
                      <Flame className="h-5 w-5 text-orange-500" />
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-1">{userProgress.teachingSessions}</div>
                    <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">Teaching Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-1">{userProgress.learningSessions}</div>
                    <div className="text-sm text-[#64748B] dark:text-[#94A3B8]">Learning Sessions</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <Button onClick={shareProgress} className="bg-[#06B6D4] hover:bg-[#0891B2] text-white">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Progress
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Leaderboard Section */}
        <section id="leaderboard" className="scroll-mt-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#0F172A] dark:text-[#F1F5F9] font-heading">
              Live Leaderboard
            </h2>
            <Badge className="bg-green-50 text-green-700 border-green-200 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Live Updates
            </Badge>
          </div>
          
          <Tabs defaultValue="teaching" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6 bg-[#F8FAFC] dark:bg-[#1E293B]">
              <TabsTrigger value="teaching" className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white">Most Teaching</TabsTrigger>
              <TabsTrigger value="learning" className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white">Most Learning</TabsTrigger>
              <TabsTrigger value="skills" className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white">Most Skills</TabsTrigger>
              <TabsTrigger value="rating" className="data-[state=active]:bg-[#0056D2] data-[state=active]:text-white">Best Rated</TabsTrigger>
            </TabsList>
            
            {Object.entries(leaderboardData).map(([category, entries]) => (
              <TabsContent key={category} value={category}>
                <div className="space-y-3">
                  {entries.map((entry) => (
                    <Card key={entry.userId} className="hover:shadow-md transition-all duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-8 h-8">
                            {getRankBadge(entry.rank)}
                          </div>
                          
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={entry.avatar} alt={entry.name} />
                            <AvatarFallback className="bg-[#0056D2]/10 text-[#0056D2] font-bold">
                              {entry.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-1">
                            <div className="font-semibold text-[#0F172A] dark:text-[#F1F5F9]">
                              {entry.name}
                            </div>
                            <Badge variant="outline" className="bg-[#0056D2]/10 text-[#0056D2] border-[#0056D2]/20 text-xs">
                              {entry.mainSkill}
                            </Badge>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-lg font-bold text-[#0056D2]">
                              {typeof entry.stat === 'number' && entry.stat % 1 !== 0 ? entry.stat.toFixed(2) : entry.stat}
                            </div>
                            <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                              {entry.statType}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </section>

        {/* Rewards & Badges */}
        <section>
          <h2 className="text-3xl font-bold text-center text-[#0F172A] dark:text-[#F1F5F9] mb-8 font-heading">
            Rewards & Badges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <Card 
                key={badge.id} 
                className={`transition-all duration-300 hover:scale-105 ${
                  badge.earned 
                    ? 'border-[#0056D2]/30 bg-gradient-to-br from-[#0056D2]/5 to-[#06B6D4]/5' 
                    : 'opacity-60 grayscale'
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{badge.icon}</div>
                  <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-2">
                    {badge.name}
                  </h3>
                  <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-3">
                    {badge.description}
                  </p>
                  <Badge 
                    variant={badge.earned ? "default" : "outline"}
                    className={badge.earned ? "bg-[#0056D2] text-white" : ""}
                  >
                    {badge.earned ? "Earned" : badge.criteria}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Hall of Fame */}
        <section id="hall-of-fame" className="scroll-mt-8">
          <h2 className="text-3xl font-bold text-center text-[#0F172A] dark:text-[#F1F5F9] mb-8 font-heading">
            Hall of Fame
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pastChampions.map((champion, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <Avatar className="h-20 w-20 mx-auto mb-4">
                    <AvatarImage src={champion.avatar} alt={champion.name} />
                    <AvatarFallback className="bg-[#0056D2]/10 text-[#0056D2] font-bold text-xl">
                      {champion.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-bold text-[#0F172A] dark:text-[#F1F5F9] mb-1">
                    {champion.name}
                  </h3>
                  <p className="text-sm text-[#64748B] dark:text-[#94A3B8] mb-2">
                    {champion.sprint}
                  </p>
                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                    <Crown className="h-3 w-3 mr-1" />
                    {champion.badge}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Map Integration Banner */}
        <section>
          <Card className="bg-gradient-to-r from-[#0056D2] to-[#06B6D4] text-white">
            <CardContent className="p-8 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                See Where Your Sprint Competitors Are From!
              </h2>
              <p className="text-white/90 mb-6">
                Explore the global SkillSwap community and find sprint participants near you.
              </p>
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10"
                onClick={() => navigate('/map?filter=sprint')}
              >
                <MapPin className="h-4 w-4 mr-2" />
                View Global Map
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Join Sprint Modal */}
      <Dialog open={showJoinModal} onOpenChange={setShowJoinModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#0F172A] dark:text-[#F1F5F9]">
              Join {currentSprint.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9] mb-3 block">
                How would you like to participate?
              </Label>
              <Select value={joinForm.role} onValueChange={(value) => setJoinForm(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mentor">Mentor (Teach skills)</SelectItem>
                  <SelectItem value="learner">Learner (Learn skills)</SelectItem>
                  <SelectItem value="both">Both (Teach & Learn)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-[#0F172A] dark:text-[#F1F5F9] mb-3 block">
                Which skills are you focusing on?
              </Label>
              <div className="flex flex-wrap gap-2">
                {['UI Design', 'Figma', 'Prototyping', 'UX Research', 'Design Systems'].map((skill) => (
                  <Badge 
                    key={skill}
                    variant={joinForm.skills.includes(skill) ? "default" : "outline"}
                    className={`cursor-pointer ${joinForm.skills.includes(skill) ? 'bg-[#0056D2] text-white' : ''}`}
                    onClick={() => {
                      setJoinForm(prev => ({
                        ...prev,
                        skills: prev.skills.includes(skill) 
                          ? prev.skills.filter(s => s !== skill)
                          : [...prev.skills, skill]
                      }));
                    }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="terms"
                checked={joinForm.agreeToTerms}
                onCheckedChange={(checked) => setJoinForm(prev => ({ ...prev, agreeToTerms: !!checked }))}
              />
              <Label htmlFor="terms" className="text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                I agree to the Sprint Rules and commit to positive, respectful participation
              </Label>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowJoinModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleJoinSprint}
                className="flex-1 bg-[#0056D2] hover:bg-[#004BB8] text-white"
              >
                Join Sprint
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sticky Mobile Join Button */}
      {!userProgress.hasJoined && (
        <div className="fixed bottom-4 left-4 right-4 md:hidden z-50">
          <Button 
            onClick={() => setShowJoinModal(true)}
            className="w-full bg-[#0056D2] hover:bg-[#004BB8] text-white font-bold py-4 rounded-xl shadow-lg"
          >
            <Users className="h-5 w-5 mr-2" />
            Join Sprint Challenge
          </Button>
        </div>
      )}
      
      {/* Sticky Countdown for Mobile */}
      {userProgress.hasJoined && (
        <div className="fixed top-16 left-4 right-4 md:hidden z-40">
          <div className="bg-white dark:bg-[#0F172A] rounded-lg p-3 shadow-lg border">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-[#64748B]">Sprint ends in:</span>
              <span className="font-bold text-[#0056D2]">
                {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillSprintPage;
