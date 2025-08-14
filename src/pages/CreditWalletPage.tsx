import React, { useState } from 'react';
import { 
  Coins, 
  TrendingUp, 
  History, 
  HelpCircle, 
  ExternalLink,
  Filter,
  Search,
  Calendar
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
import { Link, useNavigate } from 'react-router-dom';

// Mock data - in real app this would come from API/context
const mockWalletData = {
  balance: 245,
  upcomingDeductions: [
    {
      id: 'h1',
      title: 'Session with Marcus Chen',
      date: '2025-01-20T15:00:00Z',
      amount: 15
    }
  ],
  recentTransactions: [
    {
      id: 't1',
      type: 'earn' as const,
      title: 'Taught: Logo critique session',
      subtitle: 'Completed 30-min design review',
      amount: 10,
      balanceAfter: 245,
      timestamp: '2025-01-15T18:00:00Z',
      skill: 'Design',
      partnerName: 'Sarah Wilson',
      details: {
        baseAmount: 10,
        sessionLink: '/session/abc123',
        receiptLink: '/receipt/txn_001'
      }
    },
    {
      id: 't2',
      type: 'spend' as const,
      title: 'Enrolled: Brand Strategy Essentials',
      subtitle: 'Advanced course enrollment',
      amount: -150,
      balanceAfter: 235,
      timestamp: '2025-01-14T10:10:00Z',
      skill: 'Marketing',
      partnerName: 'Alex Thompson',
      details: {
        baseAmount: 150,
        receiptLink: '/receipt/txn_002'
      }
    },
    {
      id: 't3',
      type: 'earn' as const,
      title: 'Skill Sprint: Design Challenge',
      subtitle: 'Completed daily design challenge',
      amount: 5,
      balanceAfter: 385,
      timestamp: '2025-01-13T09:30:00Z',
      skill: 'Design',
      details: {
        baseAmount: 5
      }
    }
  ]
};

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

export default function CreditWalletPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getBalanceEquivalent = (balance: number) => {
    const standardSessionCost = 35;
    const sessions = Math.floor(balance / standardSessionCost);
    return `≈ ${sessions} standard 30-min sessions`;
  };

  const filteredTransactions = mockWalletData.recentTransactions.filter(txn => {
    const matchesFilter = historyFilter === 'all' || txn.type === historyFilter;
    const matchesSearch = searchQuery === '' || 
      txn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.partnerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.skill?.toLowerCase().includes(searchQuery.toLowerCase());
    
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
        // Open referral modal/page
        break;
      case 'trade':
        navigate('/trade');
        break;
      case 'test':
        // Open skill test modal/page
        break;
      default:
        console.log('Earn credits action:', action);
    }
  };

  const handleDonateCredits = () => {
    navigate('/donate');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="page-container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-foreground">Your Credit Wallet</h1>
              <p className="text-muted-foreground">
                Manage your credits, track earnings, and see transaction history
              </p>
            </div>

            <CreditBalancePill 
              balance={mockWalletData.balance} 
              isLowBalance={mockWalletData.balance < 20}
            />
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
                        {mockWalletData.balance}
                      </div>
                      <div className="text-xl font-semibold text-foreground">Credits</div>
                      <div className="text-muted-foreground">
                        {getBalanceEquivalent(mockWalletData.balance)}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Deductions */}
                {mockWalletData.upcomingDeductions.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Upcoming Deductions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {mockWalletData.upcomingDeductions.map((deduction) => (
                          <div key={deduction.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                            <div>
                              <div className="font-medium">{deduction.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {new Date(deduction.date).toLocaleDateString()}
                              </div>
                            </div>
                            <Badge variant="outline" className="text-red-600 border-red-200">
                              −{deduction.amount} credits
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
