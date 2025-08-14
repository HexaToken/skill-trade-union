import React, { useState, useEffect } from 'react';
import {
  Coins,
  TrendingUp,
  History,
  HelpCircle,
  ExternalLink,
  Filter,
  Search,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import CreditBalancePill from '@/components/CreditBalancePill';
import EarnCreditsPanel from '@/components/EarnCreditsPanel';
import SpendCreditsPanel from '@/components/SpendCreditsPanel';
import CreditTxnItem from '@/components/CreditTxnItem';
import WalletProvider, { useWallet } from '@/components/providers/WalletProvider';
import { useWalletStore } from '@/stores/wallet-store';
import { useDonations } from '@/hooks/use-credit-operations';
import { creditService } from '@/services/credit-api';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const mockSuggestedMentors = [
  {
    id: 'm1',
    name: 'Marcus Chen',
    skill: 'Full-Stack Development',
    rate: 25,
    rating: 4.9,
    avatar: 'https://picsum.photos/seed/marcus/100',
    featured: true,
    onBook: () => console.log('Book Marcus Chen')
  },
  {
    id: 'm2',
    name: 'Sarah Wilson',
    skill: 'UX Design',
    rate: 20,
    rating: 4.8,
    avatar: 'https://picsum.photos/seed/sarah/100',
    onBook: () => console.log('Book Sarah Wilson')
  }
];

const mockFeaturedCourses = [
  {
    id: 'c1',
    title: 'Advanced React Patterns',
    instructor: 'Alex Thompson',
    cost: 150,
    rating: 4.9,
    featured: true,
    onEnroll: () => console.log('Enroll in React course')
  },
  {
    id: 'c2',
    title: 'Design Systems Fundamentals',
    instructor: 'Elena Rodriguez',
    cost: 120,
    rating: 4.7,
    onEnroll: () => console.log('Enroll in Design Systems course')
  }
];

function CreditWalletPageContent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [allTransactions, setAllTransactions] = useState<any[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);

  // Use wallet store for state management
  const {
    balance,
    holds,
    recentTransactions,
    isLoading,
    error,
    fetchWallet,
    refreshBalance
  } = useWalletStore();

  const { donateCredits, isDonating } = useDonations();

  // Load wallet data on mount
  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  // Load full transaction history when needed
  const loadTransactionHistory = async () => {
    if (isLoadingTransactions) return;

    setIsLoadingTransactions(true);
    try {
      const response = await creditService.getTransactions({
        limit: 50, // Load more for history view
      });
      setAllTransactions(response.items);
    } catch (error) {
      toast({
        title: "Failed to Load History",
        description: error instanceof Error ? error.message : 'Could not load transaction history',
        variant: "destructive",
      });
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  // Load transaction history when switching to history tab
  useEffect(() => {
    if (activeTab === 'history' && allTransactions.length === 0) {
      loadTransactionHistory();
    }
  }, [activeTab]);

  const getBalanceEquivalent = (balance: number) => {
    const standardSessionCost = 35;
    const sessions = Math.floor(balance / standardSessionCost);
    return `≈ ${sessions} standard 30-min sessions`;
  };

  // Use all transactions for history tab, recent for overview
  const transactionsToFilter = activeTab === 'history' ? allTransactions : recentTransactions;

  const filteredTransactions = transactionsToFilter.filter(txn => {
    const matchesFilter = historyFilter === 'all' || txn.type === historyFilter;
    const matchesSearch = searchQuery === '' ||
      txn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.meta?.partnerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.meta?.skill?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleEarnCreditsAction = (action: string) => {
    switch (action) {
      case 'teach':
        navigate('/matches');
        break;
      case 'sprint':
        navigate('/challenges');
        break;
      case 'refer':
        // TODO: Open referral modal/page
        toast({
          title: "Coming Soon",
          description: "Referral system will be available soon!",
        });
        break;
      case 'trade':
        // TODO: Navigate to trade confirmation page
        toast({
          title: "Coming Soon",
          description: "Offline trade confirmation will be available soon!",
        });
        break;
      case 'test':
        // TODO: Open skill test modal/page
        toast({
          title: "Coming Soon",
          description: "Skill tests will be available soon!",
        });
        break;
      default:
        console.log('Earn credits action:', action);
    }
  };

  const handleDonateCredits = async () => {
    try {
      const success = await donateCredits(
        10, // Default donation amount
        { type: 'platform' },
        'Supporting the SkillSwap community'
      );

      if (success) {
        // Refresh wallet after successful donation
        await refreshBalance();
      }
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handleRefresh = async () => {
    await fetchWallet();
    if (activeTab === 'history') {
      await loadTransactionHistory();
    }
  };

  return (
    <div className="min-h-screen bg-background" data-page="credits">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="page-container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">Your Credit Wallet</h1>
              <p className="text-muted-foreground">
                Manage your credits, track earnings, and see transaction history
              </p>
              {error && (
                <p className="text-destructive text-sm mt-1">
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <CreditBalancePill
                balance={balance}
                loading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Coins className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  History
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Balance Card */}
                <Card className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border-brand-primary/20">
                  <CardContent className="p-8 text-center">
                    <div className="space-y-3">
                      <div className="text-5xl font-bold text-brand-primary">
                        {isLoading ? '...' : balance}
                      </div>
                      <div className="text-xl font-semibold text-foreground">Credits</div>
                      <div className="text-muted-foreground">
                        {getBalanceEquivalent(balance)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Deductions */}
                {holds.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Upcoming Deductions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {holds.map((hold) => (
                          <div key={hold.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div>
                              <div className="font-medium">{hold.reason}</div>
                              <div className="text-sm text-muted-foreground">
                                Release: {new Date(hold.releaseAt).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              −{hold.amount} credits
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5" />
                        Recent Activity
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setActiveTab('history')}
                      >
                        View all
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockWalletData.recentTransactions.slice(0, 5).map((transaction) => (
                        <CreditTxnItem 
                          key={transaction.id} 
                          transaction={transaction}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="space-y-4">
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={historyFilter} onValueChange={setHistoryFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="earn">Earned</SelectItem>
                      <SelectItem value="spend">Spent</SelectItem>
                      <SelectItem value="escrow">Escrow</SelectItem>
                      <SelectItem value="refund">Refunds</SelectItem>
                      <SelectItem value="adjust">Adjustments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Transaction List */}
                <div className="space-y-4">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction) => (
                      <CreditTxnItem 
                        key={transaction.id} 
                        transaction={transaction}
                      />
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <div className="text-muted-foreground">
                          {searchQuery || historyFilter !== 'all' 
                            ? 'No transactions match your filters'
                            : 'No transaction history yet'
                          }
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <EarnCreditsPanel
              onTeachSession={() => handleEarnCreditsAction('teach')}
              onJoinSprint={() => handleEarnCreditsAction('sprint')}
              onReferFriend={() => handleEarnCreditsAction('refer')}
              onConfirmTrade={() => handleEarnCreditsAction('trade')}
              onCompleteTest={() => handleEarnCreditsAction('test')}
              hasActiveMultiplier={false}
              sprintMultiplier={1.5}
            />

            <SpendCreditsPanel
              suggestedMentors={mockSuggestedMentors}
              featuredCourses={mockFeaturedCourses}
              onDonateCredits={handleDonateCredits}
            />

            {/* How Credits Work */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" />
                  How Credits Work
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0"></div>
                    <span>Earn by teaching, challenges, referrals, confirming offline trades</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0"></div>
                    <span>Spend on sessions, courses, donations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary mt-2 flex-shrink-0"></div>
                    <span>Optional escrow holds credits until both confirm</span>
                  </li>
                </ul>
                
                <Button variant="link" size="sm" className="h-auto p-0 text-brand-primary" asChild>
                  <Link to="/help/credits">
                    Read full policy
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
