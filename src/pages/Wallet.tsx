import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wallet, 
  Plus, 
  Minus, 
  TrendingUp, 
  TrendingDown,
  ArrowUpIcon, 
  ArrowDownIcon, 
  CreditCard, 
  DollarSign, 
  Gift, 
  Heart, 
  Bitcoin, 
  ExternalLink, 
  Download, 
  Filter,
  Calendar,
  Trophy,
  Star,
  Users,
  Target,
  ShoppingCart,
  BookOpen,
  Zap,
  Award,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreditDisplay } from '@/components/CreditDisplay';
import { cn } from '@/lib/utils';
import { users, organizations, creditTransactions } from '@/data/mockData';

export default function WalletPage() {
  const navigate = useNavigate();
  const currentUser = users[1]; // Marcus Chen
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showEarnDialog, setShowEarnDialog] = useState(false);
  const [showSpendDialog, setShowSpendDialog] = useState(false);
  const [showDonateDialog, setShowDonateDialog] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');

  // Extended mock transactions
  const allTransactions = [
    ...creditTransactions,
    { id: 'tx-6', userId: 'user-2', type: 'earn' as const, amount: 50, createdAt: '2024-01-21T10:00:00Z', description: 'Teaching: React Components Workshop', refSessionId: 'session-new-1' },
    { id: 'tx-7', userId: 'user-2', type: 'spend' as const, amount: -30, createdAt: '2024-01-20T14:00:00Z', description: 'Learning: Logo Design Basics', refSessionId: 'session-new-2' },
    { id: 'tx-8', userId: 'user-2', type: 'donation' as const, amount: -25, createdAt: '2024-01-19T16:00:00Z', description: 'Donated to Code for Africa' },
    { id: 'tx-9', userId: 'user-2', type: 'bonus' as const, amount: 15, createdAt: '2024-01-18T09:00:00Z', description: 'Weekly challenge completion bonus' },
    { id: 'tx-10', userId: 'user-2', type: 'refund' as const, amount: 40, createdAt: '2024-01-17T11:00:00Z', description: 'Session cancellation refund' }
  ];

  const filteredTransactions = selectedFilter === 'all' 
    ? allTransactions 
    : allTransactions.filter(tx => tx.type === selectedFilter);

  // Calculate stats
  const totalEarned = allTransactions.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
  const totalSpent = Math.abs(allTransactions.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0));
  const totalDonated = Math.abs(allTransactions.filter(tx => tx.type === 'donation').reduce((sum, tx) => sum + tx.amount, 0));
  const monthlyGrowth = 12.5; // Mock percentage

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn': return <ArrowUpIcon className="w-4 h-4 text-brand-success" />;
      case 'spend': return <ArrowDownIcon className="w-4 h-4 text-brand-danger" />;
      case 'bonus': return <Gift className="w-4 h-4 text-brand-primary" />;
      case 'donation': return <Heart className="w-4 h-4 text-brand-secondary" />;
      case 'refund': return <RefreshCw className="w-4 h-4 text-brand-secondary" />;
      default: return <CreditCard className="w-4 h-4 text-brand-neutral" />;
    }
  };

  const getTransactionColor = (type: string, amount: number) => {
    if (amount > 0) return 'text-brand-success';
    if (amount < 0) return 'text-brand-danger';
    return 'text-brand-neutral';
  };

  const handleDonate = () => {
    if (!donationAmount || !selectedOrg) return;
    
    const amount = parseInt(donationAmount);
    if (amount > currentUser.wallet.credits) return;

    // Mock donation processing
    console.log(`Donated ${amount} credits to ${selectedOrg}`);
    setShowDonateDialog(false);
    setDonationAmount('');
    setSelectedOrg('');
  };

  const quickActions = [
    {
      title: 'Earn Credits',
      description: 'Teach skills to earn credits',
      icon: Plus,
      color: 'text-green-600 bg-green-50 border-green-200',
      action: () => setShowEarnDialog(true)
    },
    {
      title: 'Spend Credits',
      description: 'Learn new skills',
      icon: Minus,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      action: () => setShowSpendDialog(true)
    },
    {
      title: 'Donate',
      description: 'Support organizations',
      icon: Heart,
      color: 'text-pink-600 bg-pink-50 border-pink-200',
      action: () => setShowDonateDialog(true)
    },
    {
      title: 'Crypto Tip',
      description: 'Tip with crypto',
      icon: Bitcoin,
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      action: () => console.log('Crypto tip coming soon')
    }
  ];

  const earnOpportunities = [
    { title: 'Teach Web Development', credits: 50, icon: BookOpen, urgency: 'High demand' },
    { title: 'Mentor JavaScript Learners', credits: 35, icon: Users, urgency: 'Medium demand' },
    { title: 'Lead Design Workshop', credits: 40, icon: Trophy, urgency: 'High demand' },
    { title: 'Code Review Session', credits: 25, icon: Target, urgency: 'Low demand' }
  ];

  const spendSuggestions = [
    { title: 'Learn Data Science', credits: 30, icon: TrendingUp, category: 'Technology' },
    { title: 'UI/UX Design Course', credits: 25, icon: Star, category: 'Design' },
    { title: 'Spanish Conversation', credits: 20, icon: Users, category: 'Languages' },
    { title: 'Photography Basics', credits: 22, icon: Award, category: 'Creative' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="page-container py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold">Wallet</h1>
              <p className="text-muted-foreground">
                Manage your credits and track your skill-sharing economy
              </p>
            </div>
            
            <Button onClick={() => navigate('/matches')}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Explore Marketplace
            </Button>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-brand-primary to-brand-secondary text-white">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white/90">Available Balance</CardTitle>
                    <CardDescription className="text-white/70">
                      SkillSwap Credits
                    </CardDescription>
                  </div>
                  <Wallet className="w-8 h-8 text-white/80" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-4xl font-bold">
                    {currentUser.wallet.credits.toLocaleString()} credits
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-white/80">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>+{monthlyGrowth}% this month</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Pro: No expiration</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
                    <div className="text-center">
                      <div className="text-xl font-semibold">{totalEarned}</div>
                      <div className="text-xs text-white/70">Total Earned</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold">{totalSpent}</div>
                      <div className="text-xs text-white/70">Total Spent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-semibold">{totalDonated}</div>
                      <div className="text-xs text-white/70">Total Donated</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Card key={index} className="hover-lift cursor-pointer" onClick={action.action}>
                    <CardContent className="p-4 text-center">
                      <div className={cn('w-12 h-12 rounded-lg mx-auto mb-3 flex items-center justify-center border', action.color)}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-medium text-sm">{action.title}</h3>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Transaction History</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="earn">Earned</SelectItem>
                        <SelectItem value="spend">Spent</SelectItem>
                        <SelectItem value="bonus">Bonuses</SelectItem>
                        <SelectItem value="donation">Donations</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-background rounded-lg">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(transaction.createdAt).toLocaleDateString()} • 
                            <span className="capitalize ml-1">{transaction.type}</span>
                          </p>
                        </div>
                      </div>
                      <div className={cn('font-semibold', getTransactionColor(transaction.type, transaction.amount))}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} credits
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredTransactions.length === 0 && (
                  <div className="text-center py-8">
                    <Filter className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No transactions found for the selected filter</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Analytics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Credits Used</span>
                    <span>180 / 500</span>
                  </div>
                  <Progress value={36} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sessions Taught</span>
                    <span>8 sessions</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Skills Learned</span>
                    <span>3 skills</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Pro Upsell */}
            <Card className="bg-gradient-to-br from-brand-amber/10 to-brand-green/10 border-brand-amber/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-amber" />
                  SkillSwap Pro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Pro for credits that never expire and exclusive benefits
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                      <span>Credits never expire</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                      <span>Priority matching</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-brand-primary rounded-full" />
                      <span>Exclusive challenges</span>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-brand-amber to-brand-green">
                    Upgrade to Pro
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Donations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5 text-pink-600" />
                  Recent Donations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {organizations.slice(0, 3).map((org) => (
                  <div key={org.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={org.logoUrl} alt={org.name} />
                      <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{org.name}</p>
                      <p className="text-xs text-muted-foreground">{org.totalDonationsReceived} credits received</p>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full" onClick={() => setShowDonateDialog(true)}>
                  <Heart className="w-4 h-4 mr-2" />
                  Donate Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Earn Credits Dialog */}
      <Dialog open={showEarnDialog} onOpenChange={setShowEarnDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Earn Credits</DialogTitle>
            <DialogDescription>
              Share your skills and earn credits
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {earnOpportunities.map((opportunity, index) => {
              const Icon = opportunity.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <Icon className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{opportunity.title}</p>
                      <p className="text-xs text-muted-foreground">{opportunity.urgency}</p>
                    </div>
                  </div>
                  <Badge variant="secondary">+{opportunity.credits} credits</Badge>
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEarnDialog(false)}>
              Close
            </Button>
            <Button onClick={() => navigate('/matches?mode=teach')}>
              Browse All Opportunities
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Spend Credits Dialog */}
      <Dialog open={showSpendDialog} onOpenChange={setShowSpendDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Spend Credits</DialogTitle>
            <DialogDescription>
              Learn new skills with your credits
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {spendSuggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{suggestion.title}</p>
                      <p className="text-xs text-muted-foreground">{suggestion.category}</p>
                    </div>
                  </div>
                  <Badge variant="outline">{suggestion.credits} credits</Badge>
                </div>
              );
            })}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSpendDialog(false)}>
              Close
            </Button>
            <Button onClick={() => navigate('/matches?mode=learn')}>
              Browse All Skills
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Donate Dialog */}
      <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Donate Credits</DialogTitle>
            <DialogDescription>
              Support organizations making a difference
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Organization</Label>
              <Select value={selectedOrg} onValueChange={setSelectedOrg}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name} - {org.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Donation Amount</Label>
              <Input
                type="number"
                placeholder="Enter credits to donate"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                max={currentUser.wallet.credits}
              />
              <p className="text-xs text-muted-foreground">
                Available: {currentUser.wallet.credits} credits
              </p>
            </div>

            {selectedOrg && (
              <Card>
                <CardContent className="p-4">
                  {(() => {
                    const org = organizations.find(o => o.id === selectedOrg);
                    return org ? (
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={org.logoUrl} alt={org.name} />
                          <AvatarFallback>{org.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{org.name}</p>
                          <p className="text-sm text-muted-foreground">{org.description}</p>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDonateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleDonate}
              disabled={!donationAmount || !selectedOrg || parseInt(donationAmount) > currentUser.wallet.credits}
            >
              <Heart className="w-4 h-4 mr-2" />
              Donate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
