import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, TrendingUp, Users, Zap, Star, Clock, Plus, Calendar, MessageCircle, Trophy, BookOpen, Award, Search } from "lucide-react";
import { users, skills, sessions, challenges } from "@/data/mockData";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Current user (in real app, this would come from auth context)
  const currentUser = users[1]; // Marcus Chen
  
  // Mock data for dashboard
  const upcomingSessions = sessions.filter(s => s.status === 'booked').slice(0, 3);
  const suggestedMatches = users.filter(u => u.id !== currentUser.id).slice(0, 2);
  const activeChallenge = challenges[0];
  
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
    <div className="page-container section-spacing">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Welcome back, {currentUser.name.split(' ')[0]}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your skills today.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/matches')}>
              <Search className="w-4 h-4 mr-2" />
              Find Match
            </Button>
            <Button variant="outline" onClick={() => navigate('/sessions')}>
              <Plus className="w-4 h-4 mr-2" />
              Offer Skill
            </Button>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Balance</CardTitle>
              <Zap className="h-4 w-4 text-brand-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gradient">{stats.credits}</div>
              <p className="text-xs text-brand-green">+{stats.recentEarning} from last session</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions This Month</CardTitle>
              <CalendarDays className="h-4 w-4 text-brand-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.sessionsThisMonth}</div>
              <p className="text-xs text-brand-green">+3 from last month</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Rating</CardTitle>
              <Star className="h-4 w-4 text-brand-amber" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-foreground">{stats.rating}</span>
                <Rating rating={stats.rating} size="sm" showNumber={false} />
              </div>
              <p className="text-xs text-muted-foreground">Based on {currentUser.ratingCount} reviews</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Skills Offered</CardTitle>
              <TrendingUp className="h-4 w-4 text-brand-green" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stats.skillsOffered}</div>
              <p className="text-xs text-muted-foreground">2 actively teaching</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Upcoming Sessions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-brand-primary" />
                    Upcoming Sessions
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate('/sessions')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Book New
                  </Button>
                </CardTitle>
                <CardDescription>Your scheduled learning and teaching sessions</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingSessions.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.map((session) => {
                      const teacher = users.find(u => u.id === session.teacherId);
                      const skill = skills.find(s => s.id === session.skillId);
                      
                      return (
                        <div key={session.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                          <div className="flex items-center space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={teacher?.avatarUrl} />
                              <AvatarFallback>{teacher?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-foreground">{skill?.name}</p>
                              <p className="text-sm text-muted-foreground">with {teacher?.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(session.startsAt).toLocaleDateString()} at {new Date(session.startsAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                <Badge variant="outline" size="sm">{session.type}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <MessageCircle className="w-4 h-4" />
                            </Button>
                            <Button size="sm">Join</Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No upcoming sessions</p>
                    <Button onClick={() => navigate('/matches')}>Find a Teacher</Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Suggested Matches */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-secondary" />
                    AI Suggested Matches
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate('/matches')}>
                    View All
                  </Button>
                </CardTitle>
                <CardDescription>Perfect skill partners based on your interests</CardDescription>
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
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-brand-green" />
                  Learning Progress
                </CardTitle>
                <CardDescription>Track your skill development journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {learningProgress.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <ProgressRing progress={item.progress} size="sm">
                        <span className="text-xs font-medium">{item.progress}%</span>
                      </ProgressRing>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground">{item.skill}</span>
                          <Badge variant="outline" size="sm">{item.level}</Badge>
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
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-brand-amber" />
                  Active Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">{activeChallenge.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{activeChallenge.goal}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress:</span>
                      <span className="font-medium">28/30 days</span>
                    </div>
                    <Progress value={93} className="h-2 mt-2" />
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Reward:</span>
                      <span className="font-medium text-brand-amber ml-1">{activeChallenge.rewardCredits} credits</span>
                    </div>
                    <Badge variant="secondary">Rank #1</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Your Skills */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-primary" />
                  Your Skills
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
  );
};

export default Dashboard;
