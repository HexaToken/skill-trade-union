import { Link } from 'react-router-dom';
import { Wallet, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CreditDisplay } from '@/components/CreditDisplay';
import { cn } from '@/lib/utils';
import { currentUser } from '@/data/mockData';

interface WalletWidgetProps {
  variant?: 'mini' | 'compact' | 'full';
  className?: string;
}

export function WalletWidget({ variant = 'mini', className }: WalletWidgetProps) {
  const { wallet } = currentUser;
  
  // Calculate recent activity for display
  const recentTransactions = wallet.txHistory.slice(0, 3);
  const totalEarned = wallet.txHistory
    .filter(tx => ['earn', 'bonus', 'refund'].includes(tx.type))
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const totalSpent = Math.abs(wallet.txHistory
    .filter(tx => ['spend', 'donation'].includes(tx.type))
    .reduce((sum, tx) => sum + tx.amount, 0));

  if (variant === 'mini') {
    return (
      <Button 
        variant="ghost" 
        size="sm" 
        className={cn('hover-scale gap-2', className)}
        asChild
      >
        <Link to="/wallet">
          <Wallet className="h-4 w-4 text-brand-amber" />
          <span className="font-medium tabular-nums">
            {wallet.credits.toLocaleString()}
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            credits
          </span>
        </Link>
      </Button>
    );
  }

  if (variant === 'compact') {
    return (
      <Card className={cn('glass-card', className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-primary/10">
                <Wallet className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <CreditDisplay amount={wallet.credits} size="md" />
                <p className="text-xs text-muted-foreground">Available Balance</p>
              </div>
            </div>
            
            <Button size="sm" className="btn-neo" asChild>
              <Link to="/wallet">
                <Plus className="h-4 w-4 mr-1" />
                Earn
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('glass-card', className)}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10">
              <Wallet className="h-6 w-6 text-brand-primary" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg">Credit Wallet</h3>
              <p className="text-sm text-muted-foreground">Your skill trading currency</p>
            </div>
          </div>
          
          <Badge variant="secondary" className="bg-brand-green/10 text-brand-green border-brand-green/20">
            <TrendingUp className="w-3 h-3 mr-1" />
            Active
          </Badge>
        </div>

        {/* Balance */}
        <div className="text-center mb-6">
          <CreditDisplay amount={wallet.credits} size="xl" className="mb-2" />
          <p className="text-sm text-muted-foreground">
            Available for learning and trading
          </p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 rounded-lg bg-brand-green/5 border border-brand-green/20">
            <div className="text-lg font-bold text-brand-green">
              +{totalEarned.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Earned</div>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-brand-red/5 border border-brand-red/20">
            <div className="text-lg font-bold text-brand-red">
              -{totalSpent.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Spent</div>
          </div>
        </div>

        {/* Recent activity */}
        {recentTransactions.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium mb-3">Recent Activity</h4>
            <div className="space-y-2">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground truncate">
                    {transaction.description}
                  </span>
                  <CreditDisplay 
                    amount={transaction.amount} 
                    size="sm" 
                    showSign 
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="btn-neo" asChild>
            <Link to="/matches">
              <Plus className="h-4 w-4 mr-2" />
              Earn Credits
            </Link>
          </Button>
          
          <Button variant="outline" asChild>
            <Link to="/wallet">
              View Wallet
            </Link>
          </Button>
        </div>

        {/* Pro upgrade hint */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-brand-primary/5 to-brand-secondary/5 border border-brand-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Upgrade to Pro</p>
              <p className="text-xs text-muted-foreground">
                Credits never expire + analytics
              </p>
            </div>
            <Button size="sm" variant="outline" className="btn-glass">
              Upgrade
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
