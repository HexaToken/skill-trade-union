import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ArrowDownIcon, ArrowUpIcon, CreditCard, DollarSign, Gift, Plus, TrendingUp, Calendar, Trophy, Heart, Bitcoin, ExternalLink, Download, Filter } from "lucide-react";
import { users, organizations, creditTransactions } from "@/data/mockData";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function WalletPage() {
  const navigate = useNavigate();
  const currentUser = users[1]; // Marcus Chen
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  // Extended mock transactions
  const allTransactions = [
    ...creditTransactions,
    { id: 'tx-4', userId: 'user-2', type: 'earn' as const, amount: 50, createdAt: '2024-01-21T10:00:00Z', description: 'Teaching: React Components Workshop', refSessionId: 'session-new-1' },
    { id: 'tx-5', userId: 'user-2', type: 'spend' as const, amount: -30, createdAt: '2024-01-20T14:00:00Z', description: 'Learning: Logo Design Basics', refSessionId: 'session-new-2' },
    { id: 'tx-6', userId: 'user-2', type: 'donation' as const, amount: -25, createdAt: '2024-01-19T16:00:00Z', description: 'Donated to Code for Africa' },
    { id: 'tx-7', userId: 'user-2', type: 'bonus' as const, amount: 15, createdAt: '2024-01-18T09:00:00Z', description: 'Weekly challenge completion bonus' }
  ];

  const filteredTransactions = selectedFilter === "all" 
    ? allTransactions 
    : allTransactions.filter(tx => tx.type === selectedFilter);

  const monthlyStats = {
    earned: 115,
    spent: 55,
    donated: 25,
    net: 60
  };

  const achievements = [
    { title: "Early Adopter", description: "Joined in first 1000 users", icon: "🚀", earned: true },
    { title: "Generous Donor", description: "Donated 100+ credits", icon: "❤️", earned: true },
    { title: "Master Teacher", description: "Taught 50+ sessions", icon: "🏆", earned: false, progress: 75 },
    { title: "Super Learner", description: "Completed 25+ learning sessions", icon: "🎓", earned: false, progress: 60 }
  ];

  return (
    <div className="page-container section-spacing">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">Credits Wallet</h1>
            <p className="text-muted-foreground">Manage your credits, view transactions, and support causes you care about.</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate('/matches')}>
              <Plus className="w-4 h-4 mr-2" />
              Earn Credits
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-brand-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gradient">{currentUser.wallet.credits}</div>
              <p className="text-xs text-muted-foreground">Available credits</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-brand-green" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-green">+{monthlyStats.net}</div>
              <p className="text-xs text-muted-foreground">Net earnings</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <ArrowUpIcon className="h-4 w-4 text-brand-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">1,247</div>
              <p className="text-xs text-muted-foreground">Lifetime earnings</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
              <Gift className="h-4 w-4 text-brand-red" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-brand-red">127</div>
              <p className="text-xs text-muted-foreground">Credits given</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="transactions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="earn">Earn More</TabsTrigger>
            <TabsTrigger value="donate">Donate</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">Transaction History</h2>
              <div className="flex gap-3">
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="earn">Earned</SelectItem>
                    <SelectItem value="spend">Spent</SelectItem>
                    <SelectItem value="bonus">Bonuses</SelectItem>
                    <SelectItem value="donation">Donations</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>

            <Card className="glass-card">
              <CardContent className="p-0">
                <div className="space-y-0">
                  {filteredTransactions.map((tx, index) => (
                    <div key={tx.id} className={`flex items-center justify-between p-6 ${index !== filteredTransactions.length - 1 ? 'border-b border-border/50' : ''} hover:bg-card/30 transition-colors`}>
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-full ${
                          tx.type === 'earn' ? 'bg-brand-green/10 text-brand-green' :
                          tx.type === 'spend' ? 'bg-brand-red/10 text-brand-red' :
                          tx.type === 'bonus' ? 'bg-brand-amber/10 text-brand-amber' :
                          'bg-brand-primary/10 text-brand-primary'
                        }`}>
                          {tx.type === 'earn' ? <ArrowUpIcon className="h-4 w-4" /> :
                           tx.type === 'spend' ? <ArrowDownIcon className="h-4 w-4" /> :
                           tx.type === 'bonus' ? <Trophy className="h-4 w-4" /> :
                           <Gift className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{tx.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                            {tx.refSessionId && <Badge variant="outline" size="sm">Session</Badge>}
                          </div>
                        </div>
                      </div>
                      <div className={`text-lg font-semibold ${tx.amount > 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earn" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-brand-green" />
                  Ways to Earn Credits
                </CardTitle>
                <CardDescription>Multiple opportunities to grow your credit balance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="p-6 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                    <h3 className="font-semibold text-foreground mb-2">🎓 Teach Skills</h3>
                    <p className="text-sm text-muted-foreground mb-4">Share your expertise in 1:1 or group sessions</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brand-green">15-80 credits/hour</span>
                      <Button size="sm" onClick={() => navigate('/matches')}>Start Teaching</Button>
                    </div>
                  </div>

                  <div className="p-6 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                    <h3 className="font-semibold text-foreground mb-2">🏆 Complete Challenges</h3>
                    <p className="text-sm text-muted-foreground mb-4">Join community challenges and competitions</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brand-amber">50-500 credits</span>
                      <Button size="sm" onClick={() => navigate('/challenges')}>View Challenges</Button>
                    </div>
                  </div>

                  <div className="p-6 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                    <h3 className="font-semibold text-foreground mb-2">📝 Write Reviews</h3>
                    <p className="text-sm text-muted-foreground mb-4">Help others by reviewing your learning sessions</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brand-secondary">5 credits</span>
                      <Button size="sm" variant="outline">Write Review</Button>
                    </div>
                  </div>

                  <div className="p-6 rounded-lg border border-border/50 bg-card/30 hover:bg-card/50 transition-colors">
                    <h3 className="font-semibold text-foreground mb-2">🔗 Refer Friends</h3>
                    <p className="text-sm text-muted-foreground mb-4">Earn when friends join and complete their first session</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-brand-primary">25 credits</span>
                      <Button size="sm" variant="outline">Invite Friends</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="donate" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-brand-red" />
                    Donate Credits
                  </CardTitle>
                  <CardDescription>Support education and skill-building programs worldwide</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {organizations.map((org) => (
                    <div key={org.id} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={org.logoUrl} alt={org.name} />
                          <AvatarFallback>{org.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-foreground">{org.name}</h4>
                          <p className="text-xs text-muted-foreground">{org.description}</p>
                        </div>
                      </div>
                      <Button size="sm">Donate</Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bitcoin className="w-5 h-5 text-brand-amber" />
                    Crypto Tips
                  </CardTitle>
                  <CardDescription>Convert credits to crypto tips for teachers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-brand-amber/10 to-brand-primary/10">
                    <h4 className="font-medium text-foreground mb-2">💡 Coming Soon</h4>
                    <p className="text-sm text-muted-foreground mb-3">Tip your favorite teachers with cryptocurrency directly from your credits wallet.</p>
                    <div className="flex gap-2">
                      <Badge variant="secondary" size="sm">Bitcoin</Badge>
                      <Badge variant="secondary" size="sm">Ethereum</Badge>
                      <Badge variant="secondary" size="sm">USDC</Badge>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline" disabled>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-brand-amber" />
                  Your Achievements
                </CardTitle>
                <CardDescription>Unlock badges and earn bonus credits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {achievements.map((achievement, index) => (
                    <div key={index} className={`p-4 rounded-lg border transition-colors ${
                      achievement.earned 
                        ? 'bg-brand-green/5 border-brand-green/20' 
                        : 'border-border/50 bg-card/30'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{achievement.icon}</span>
                          <div>
                            <h4 className="font-medium text-foreground">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          </div>
                        </div>
                        {achievement.earned && (
                          <Badge className="bg-brand-green text-white">Earned</Badge>
                        )}
                      </div>
                      {!achievement.earned && achievement.progress && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-muted-foreground">Progress</span>
                            <span className="text-xs font-medium">{achievement.progress}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
