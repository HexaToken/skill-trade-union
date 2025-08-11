import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Rating } from "@/components/ui/rating";
import { ProgressRing } from "@/components/ui/progress-ring";
import { WalletWidget } from "@/components/WalletWidget";
import { MatchTile } from "@/components/MatchTile";
import SkillCard from "@/components/SkillCard";
import OfflineTradeButton from "@/components/OfflineTradeButton";
import { CalendarDays, TrendingUp, Users, Zap, Star, Clock, Plus, Calendar, MessageCircle, Trophy, BookOpen, Award, Search } from "lucide-react";
import { users, skills, sessions, challenges } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { mockOfflineTrades, getTradesAwaitingUser, getPendingTradesByUser, getTradeParticipants } from "@/mock/offline-trade-data";
import { getTradeStatusColor, getTradeStatusLabel } from "@/models/offline-trade-types";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Current user (in real app, this would come from auth context)
  const currentUser = users[1]; // Marcus Chen
  
  // Mock data for dashboard
  const upcomingSessions = sessions.filter(s => s.status === 'booked').slice(0, 3);
  const suggestedMatches = users.filter(u => u.id !== currentUser.id).slice(0, 2);
  const activeChallenge = challenges[0];

  // Offline trades data
  const tradesAwaitingMe = getTradesAwaitingUser(currentUser.id);
  const pendingTrades = getPendingTradesByUser(currentUser.id);
  const recentTrades = mockOfflineTrades
    .filter(trade => trade.initiatorId === currentUser.id || trade.counterpartyId === currentUser.id)
    .slice(0, 3);
  
  const stats = {
    credits: currentUser.wallet.credits,
    sessionsThisMonth: 12,
    rating: currentUser.ratingAvg,
    skillsOffered: currentUser.skillsOffered.length,
    recentEarning: 45
  };

  const learningProgress = [
    { skill: 'Spanish Tutoring', progress: 75, level: 'Intermediate' },
    { skill: 'Photography', progress: 45, level: 'Beginner' },
    { skill: 'Guitar', progress: 20, level: 'Beginner' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F172A]">
      <div className="page-container py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-[#0F172A] dark:text-[#F1F5F9]">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
              <p className="text-[#334155] dark:text-[#E2E8F0]">Here's what's happening with your skills today.</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => navigate('/matches')} className="bg-[#0056D2] hover:bg-[#004BB8] text-white shadow-sm font-semibold">
                <Search className="w-4 h-4 mr-2" />
                Find Match
              </Button>
              <Button onClick={() => navigate('/sessions')} className="bg-[#06B6D4] hover:bg-[#0891B2] text-white shadow-sm font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Offer Skill
              </Button>
              <OfflineTradeButton
                variant="outline"
                className="text-[#0056D2] border-[#0056D2]/30 hover:bg-[#0056D2]/10 shadow-sm font-semibold"
              />
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0]">Credits Balance</CardTitle>
                <Zap className="h-4 w-4 text-[#06B6D4]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0056D2]">{stats.credits}</div>
                <p className="text-xs text-emerald-600">+{stats.recentEarning} from last session</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0]">Sessions This Month</CardTitle>
                <CalendarDays className="h-4 w-4 text-[#0056D2]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0056D2]">{stats.sessionsThisMonth}</div>
                <p className="text-xs text-emerald-600">+3 from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0]">Your Rating</CardTitle>
                <Star className="h-4 w-4 text-[#06B6D4]" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl font-bold text-[#0056D2]">{stats.rating}</span>
                  <Rating rating={stats.rating} size="sm" showNumber={false} />
                </div>
                <p className="text-xs text-[#334155] dark:text-[#E2E8F0]">Based on {currentUser.ratingCount} reviews</p>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#334155] dark:text-[#E2E8F0]">Skills Offered</CardTitle>
                <TrendingUp className="h-4 w-4 text-[#0056D2]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#0056D2]">{stats.skillsOffered}</div>
                <p className="text-xs text-[#334155] dark:text-[#E2E8F0]">2 actively teaching</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Upcoming Sessions */}
              <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#0056D2]" />
                      <span className="text-[#0F172A] dark:text-[#F1F5F9] font-heading">Upcoming Sessions</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => navigate('/sessions')} className="border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Book New
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-[#334155] dark:text-[#E2E8F0]">Your scheduled learning and teaching sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingSessions.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingSessions.map((session) => {
                        const teacher = users.find(u => u.id === session.teacherId);
                        const skill = skills.find(s => s.id === session.skillId);
                        
                        return (
                          <div key={session.id} className="flex items-center justify-between p-4 rounded-xl border border-[#06B6D4]/20 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                            <div className="flex items-center space-x-4">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src={teacher?.avatarUrl} />
                                <AvatarFallback className="bg-[#0056D2]/10 text-[#0056D2]">{teacher?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">{skill?.name}</p>
                                <p className="text-sm text-[#334155] dark:text-[#E2E8F0]">with {teacher?.name}</p>
                                <div className="flex items-center gap-2 text-xs text-[#334155] dark:text-[#E2E8F0]">
                                  <Clock className="h-3 w-3" />
                                  <span>{new Date(session.startsAt).toLocaleDateString()} at {new Date(session.startsAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                  <Badge variant="outline" size="sm" className="border-[#06B6D4]/20">{session.type}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white">
                                <MessageCircle className="w-4 h-4" />
                              </Button>
                              <Button size="sm" className="bg-[#0056D2] hover:bg-[#004BB8] text-white">Join</Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="w-12 h-12 text-[#334155] dark:text-[#E2E8F0] mx-auto mb-4" />
                      <p className="text-[#334155] dark:text-[#E2E8F0] mb-4">No upcoming sessions</p>
                      <Button onClick={() => navigate('/matches')} className="bg-[#0056D2] hover:bg-[#004BB8] text-white">Find a Teacher</Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Offline Trades */}
              <Card className="bg-white dark:bg-[#1E293B] border-[#0056D2]/20 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#0056D2]" />
                      <span className="text-[#0F172A] dark:text-[#F1F5F9] font-heading">Offline Trades</span>
                      {tradesAwaitingMe.length > 0 && (
                        <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">
                          {tradesAwaitingMe.length} pending
                        </Badge>
                      )}
                    </div>
                    <OfflineTradeButton
                      variant="outline"
                      size="sm"
                      className="border-[#0056D2] text-[#0056D2] hover:bg-[#0056D2] hover:text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Log Trade
                    </OfflineTradeButton>
                  </CardTitle>
                  <CardDescription className="text-[#334155] dark:text-[#E2E8F0]">
                    Manage your in-person skill trades and confirmations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tradesAwaitingMe.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-[#0F172A] dark:text-[#F1F5F9] mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-red-600" />
                        Awaiting Your Confirmation ({tradesAwaitingMe.length})
                      </h4>
                      <div className="space-y-3">
                        {tradesAwaitingMe.map((trade) => {
                          const participants = getTradeParticipants(trade);
                          if (!participants) return null;
                          const { initiator } = participants;

                          return (
                            <div key={trade.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={initiator.avatar} alt={initiator.name} />
                                  <AvatarFallback className="bg-[#0056D2]/10 text-[#0056D2] text-xs font-bold">
                                    {initiator.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-[#0F172A] dark:text-[#F1F5F9] text-sm">
                                    {trade.skill} with {initiator.name}
                                  </div>
                                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                                    {trade.creditsProposed} credits • {new Date(trade.startedAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => navigate(`/trade/${trade.id}/confirm`)}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs"
                              >
                                Confirm
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {recentTrades.length > 0 ? (
                    <div>
                      <h4 className="font-medium text-[#0F172A] dark:text-[#F1F5F9] mb-3">Recent Trades</h4>
                      <div className="space-y-3">
                        {recentTrades.map((trade) => {
                          const participants = getTradeParticipants(trade);
                          if (!participants) return null;
                          const otherPerson = trade.initiatorId === currentUser.id ? participants.counterparty : participants.initiator;

                          return (
                            <div key={trade.id} className="flex items-center justify-between p-3 bg-[#F8FAFC] dark:bg-[#0F172A] rounded-lg border">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarImage src={otherPerson.avatar} alt={otherPerson.name} />
                                  <AvatarFallback className="bg-[#06B6D4]/10 text-[#06B6D4] text-xs font-bold">
                                    {otherPerson.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium text-[#0F172A] dark:text-[#F1F5F9] text-sm">
                                    {trade.skill} with {otherPerson.name}
                                  </div>
                                  <div className="text-xs text-[#64748B] dark:text-[#94A3B8] flex items-center gap-2">
                                    {trade.creditsActual || trade.creditsProposed} credits • {new Date(trade.startedAt).toLocaleDateString()}
                                    <Badge className={`${getTradeStatusColor(trade.status)} text-xs`}>
                                      {getTradeStatusLabel(trade.status)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/trade/${trade.id}/receipt`)}
                                className="text-[#0056D2] hover:text-[#004BB8] text-xs"
                              >
                                View
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : tradesAwaitingMe.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-12 h-12 text-[#334155] dark:text-[#E2E8F0] mx-auto mb-4" />
                      <p className="text-[#334155] dark:text-[#E2E8F0] mb-4">No offline trades yet</p>
                      <OfflineTradeButton className="bg-[#0056D2] hover:bg-[#004BB8] text-white">
                        Log Your First Trade
                      </OfflineTradeButton>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Suggested Matches */}
              <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#06B6D4]" />
                      <span className="text-[#0F172A] dark:text-[#F1F5F9] font-heading">AI Suggested Matches</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => navigate('/matches')} className="border-[#06B6D4] text-[#06B6D4] hover:bg-[#06B6D4] hover:text-white">
                      View All
                    </Button>
                  </CardTitle>
                  <CardDescription className="text-[#334155] dark:text-[#E2E8F0]">Perfect skill partners based on your interests</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {suggestedMatches.map((user) => {
                      const userSkill = user.skillsOffered[0];
                      const skill = skills.find(s => s.id === userSkill.skillId);
                      
                      return skill ? (
                        <MatchTile
                          key={user.id}
                          user={user}
                          skill={skill}
                          matchScore={Math.floor(Math.random() * 20) + 80}
                          distance={`${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 9)} km`}
                          nextAvailable="Today, 3:00 PM"
                          onMessage={() => {}}
                          onBookSession={() => navigate('/sessions')}
                          onViewProfile={() => navigate('/profile')}
                        />
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Learning Progress */}
              <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                    <span className="text-[#0F172A] dark:text-[#F1F5F9] font-heading">Learning Progress</span>
                  </CardTitle>
                  <CardDescription className="text-[#334155] dark:text-[#E2E8F0]">Track your skill development journey</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {learningProgress.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <ProgressRing progress={item.progress} size="sm">
                          <span className="text-xs font-medium text-[#0056D2]">{item.progress}%</span>
                        </ProgressRing>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">{item.skill}</span>
                            <Badge variant="outline" size="sm" className="border-[#06B6D4]/20">{item.level}</Badge>
                          </div>
                          <Progress value={item.progress} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Wallet Widget */}
              <WalletWidget
                credits={stats.credits}
                recentEarning={stats.recentEarning}
                isPro={false}
                variant="detailed"
                onEarnCredits={() => navigate('/matches')}
                onViewWallet={() => navigate('/wallet')}
              />

              {/* Active Challenge */}
              <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span className="text-[#0F172A] dark:text-[#F1F5F9] font-heading">Active Challenge</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-[#0F172A] dark:text-[#F1F5F9] mb-2">{activeChallenge.title}</h4>
                      <p className="text-sm text-[#334155] dark:text-[#E2E8F0] mb-3">{activeChallenge.goal}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#334155] dark:text-[#E2E8F0]">Progress:</span>
                        <span className="font-medium text-[#0F172A] dark:text-[#F1F5F9]">28/30 days</span>
                      </div>
                      <Progress value={93} className="h-2 mt-2" />
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#06B6D4]/20">
                      <div className="text-sm">
                        <span className="text-[#334155] dark:text-[#E2E8F0]">Reward:</span>
                        <span className="font-medium text-amber-500 ml-1">{activeChallenge.rewardCredits} credits</span>
                      </div>
                      <Badge variant="secondary" className="bg-[#06B6D4]/10 text-[#06B6D4]">Rank #1</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Your Skills */}
              <Card className="bg-white dark:bg-[#1E293B] border-[#06B6D4]/20 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)] transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#0056D2]" />
                    <span className="text-[#0F172A] dark:text-[#F1F5F9] font-heading">Your Skills</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {currentUser.skillsOffered.map((skillOffer) => {
                      const skill = skills.find(s => s.id === skillOffer.skillId);
                      return skill ? (
                        <SkillCard 
                          key={skill.id}
                          skill={skill}
                          variant="compact"
                          showDemand={false}
                          onClick={() => navigate('/profile')}
                        />
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
