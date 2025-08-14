import React, { useState } from 'react';
import { 
  X, 
  Coins, 
  TrendingUp, 
  History, 
  Heart, 
  Calendar,
  Filter,
  Search,
  Zap
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EarnCreditsPanel from './EarnCreditsPanel';
import CreditTxnItem from './CreditTxnItem';
import { cn } from '@/lib/utils';

interface UpcomingDeduction {
  id: string;
  title: string;
  date: string;
  amount: number;
}

interface WalletData {
  balance: number;
  upcomingDeductions: UpcomingDeduction[];
  recentTransactions: Array<{
    id: string;
    type: 'earn' | 'spend' | 'adjust' | 'escrow' | 'refund';
    title: string;
    subtitle?: string;
    amount: number;
    balanceAfter: number;
    timestamp: string;
    skill?: string;
    partnerName?: string;
    details?: any;
  }>;
}

interface CreditWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletData: WalletData;
  onEarnCreditsAction?: (action: string) => void;
  onDonateCredits?: () => void;
  className?: string;
}

export default function CreditWalletModal({
  isOpen,
  onClose,
  walletData,
  onEarnCreditsAction,
  onDonateCredits,
  className
}: CreditWalletModalProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [historyFilter, setHistoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const getBalanceEquivalent = (balance: number) => {
    const standardSessionCost = 35; // Assuming 35 credits for a standard session
    const sessions = Math.floor(balance / standardSessionCost);
    return `≈ ${sessions} standard 30-min sessions`;
  };

  const filteredTransactions = walletData.recentTransactions.filter(txn => {
    const matchesFilter = historyFilter === 'all' || txn.type === historyFilter;
    const matchesSearch = searchQuery === '' || 
      txn.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.partnerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.skill?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("max-w-4xl max-h-[90vh] overflow-hidden", className)}>
        <DialogHeader className="pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Coins className="w-6 h-6 text-brand-primary" />
            Credit Wallet
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="earn" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Earn
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6 space-y-6 overflow-y-auto max-h-[60vh]">
            {/* Balance Card */}
            <Card className="bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border-brand-primary/20">
              <CardContent className="p-6 text-center">
                <div className="space-y-2">
                  <div className="text-4xl font-bold text-brand-primary">
                    {walletData.balance}
                  </div>
                  <div className="text-lg font-semibold text-foreground">Credits</div>
                  <div className="text-sm text-muted-foreground">
                    {getBalanceEquivalent(walletData.balance)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                size="lg" 
                className="h-14"
                onClick={() => setActiveTab('earn')}
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Earn Credits
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14"
                onClick={onDonateCredits}
              >
                <Heart className="w-5 h-5 mr-2" />
                Donate Credits
              </Button>
            </div>

            {/* Upcoming Deductions */}
            {walletData.upcomingDeductions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="w-5 h-5" />
                    Upcoming Deductions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {walletData.upcomingDeductions.map((deduction) => (
                      <div key={deduction.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <div className="font-medium">{deduction.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(deduction.date).toLocaleDateString()}
                          </div>
                        </div>
                        <Badge variant="outline">
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
                  <CardTitle className="flex items-center gap-2 text-lg">
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
                <div className="space-y-3">
                  {walletData.recentTransactions.slice(0, 3).map((transaction) => (
                    <CreditTxnItem 
                      key={transaction.id} 
                      transaction={transaction}
                      className="shadow-none border-0 bg-muted/30"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Earn Tab */}
          <TabsContent value="earn" className="mt-6 overflow-y-auto max-h-[60vh]">
            <EarnCreditsPanel
              onTeachSession={() => onEarnCreditsAction?.('teach')}
              onJoinSprint={() => onEarnCreditsAction?.('sprint')}
              onReferFriend={() => onEarnCreditsAction?.('refer')}
              onConfirmTrade={() => onEarnCreditsAction?.('trade')}
              onCompleteTest={() => onEarnCreditsAction?.('test')}
              onDonate={() => onEarnCreditsAction?.('donate')}
              hasActiveMultiplier={false}
              sprintMultiplier={1.5}
            />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6 space-y-4 overflow-hidden">
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
            <div className="space-y-3 overflow-y-auto max-h-[45vh]">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <CreditTxnItem 
                    key={transaction.id} 
                    transaction={transaction}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
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
      </DialogContent>
    </Dialog>
  );
}
