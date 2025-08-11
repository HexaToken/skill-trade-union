import { ArrowUpRight, ArrowDownRight, Gift, Heart, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CreditTransaction } from '@/models/types';

interface CreditDisplayProps {
  amount: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSign?: boolean;
  className?: string;
}

export function CreditDisplay({ 
  amount, 
  size = 'md', 
  showSign = false, 
  className 
}: CreditDisplayProps) {
  const isPositive = amount > 0;
  const isNegative = amount < 0;
  
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const colorClass = isPositive 
    ? 'credits-positive' 
    : isNegative 
    ? 'credits-negative' 
    : 'credits-neutral';

  return (
    <span className={cn(
      'font-medium tabular-nums',
      sizeClasses[size],
      colorClass,
      className
    )}>
      {showSign && isPositive && '+'}
      {Math.abs(amount).toLocaleString()}
      <span className="ml-1 text-xs opacity-75">credits</span>
    </span>
  );
}

interface CreditTransactionItemProps {
  transaction: CreditTransaction;
  compact?: boolean;
  className?: string;
}

export function CreditTransactionItem({ 
  transaction, 
  compact = false, 
  className 
}: CreditTransactionItemProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earn':
        return <ArrowUpRight className="w-4 h-4 text-brand-green" />;
      case 'spend':
        return <ArrowDownRight className="w-4 h-4 text-brand-red" />;
      case 'bonus':
        return <Gift className="w-4 h-4 text-brand-primary" />;
      case 'donation':
        return <Heart className="w-4 h-4 text-brand-red" />;
      case 'refund':
        return <RotateCcw className="w-4 h-4 text-brand-green" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-muted" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'earn':
      case 'bonus':
      case 'refund':
        return 'bg-brand-green/10 text-brand-green border-brand-green/20';
      case 'spend':
      case 'donation':
        return 'bg-brand-red/10 text-brand-red border-brand-red/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    if (compact) {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  if (compact) {
    return (
      <div className={cn('flex items-center justify-between py-2', className)}>
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-background/50">
            {getTransactionIcon(transaction.type)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">{formatDate(transaction.createdAt)}</p>
          </div>
        </div>
        
        <CreditDisplay 
          amount={transaction.amount} 
          size="sm" 
          showSign 
        />
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-4 p-4 rounded-lg border', className)}>
      <div className={cn('p-2 rounded-lg', getTransactionColor(transaction.type))}>
        {getTransactionIcon(transaction.type)}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium">{transaction.description}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {formatDate(transaction.createdAt)}
            </p>
            {transaction.refSessionId && (
              <p className="text-xs text-muted-foreground mt-1">
                Session ID: {transaction.refSessionId}
              </p>
            )}
          </div>
          
          <div className="text-right">
            <CreditDisplay 
              amount={transaction.amount} 
              showSign 
              className="text-base"
            />
            <div className="text-xs text-muted-foreground mt-1 capitalize">
              {transaction.type}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CreditBalanceProps {
  balance: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  className?: string;
}

export function CreditBalance({ 
  balance, 
  size = 'md', 
  showLabel = true, 
  className 
}: CreditBalanceProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  const labelSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={cn('text-center', className)}>
      <div className={cn(
        'font-bold text-foreground tabular-nums',
        sizeClasses[size]
      )}>
        {balance.toLocaleString()}
      </div>
      {showLabel && (
        <div className={cn(
          'text-muted-foreground font-medium',
          labelSizeClasses[size]
        )}>
          Credits Available
        </div>
      )}
    </div>
  );
}

interface CreditEarningsProps {
  totalEarned: number;
  totalSpent: number;
  period?: string;
  className?: string;
}

export function CreditEarnings({ 
  totalEarned, 
  totalSpent, 
  period = 'this month',
  className 
}: CreditEarningsProps) {
  const netChange = totalEarned - totalSpent;
  
  return (
    <div className={cn('space-y-3', className)}>
      <div className="text-sm text-muted-foreground text-center">
        Credit activity {period}
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-brand-green">
            +{totalEarned.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Earned</div>
        </div>
        
        <div>
          <div className="text-lg font-bold text-brand-red">
            -{totalSpent.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Spent</div>
        </div>
        
        <div>
          <div className={cn(
            'text-lg font-bold',
            netChange >= 0 ? 'text-brand-green' : 'text-brand-red'
          )}>
            {netChange >= 0 ? '+' : ''}{netChange.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Net</div>
        </div>
      </div>
    </div>
  );
}

interface CreditPriceDisplayProps {
  baseCredits: number;
  complexityMultiplier?: number;
  demandMultiplier?: number;
  duration?: number; // in hours
  showBreakdown?: boolean;
  className?: string;
}

export function CreditPriceDisplay({
  baseCredits,
  complexityMultiplier = 1,
  demandMultiplier = 1,
  duration = 1,
  showBreakdown = false,
  className
}: CreditPriceDisplayProps) {
  const finalPrice = Math.round(baseCredits * complexityMultiplier * demandMultiplier * duration);
  
  if (!showBreakdown) {
    return (
      <div className={cn('text-right', className)}>
        <div className="text-2xl font-bold text-brand-primary">
          {finalPrice.toLocaleString()}
        </div>
        <div className="text-sm text-muted-foreground">credits</div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2 p-4 rounded-lg bg-muted/30', className)}>
      <div className="text-sm font-medium text-foreground mb-3">Price Breakdown</div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Base rate ({duration}h)</span>
          <span>{(baseCredits * duration).toLocaleString()} credits</span>
        </div>
        
        {complexityMultiplier !== 1 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Complexity ({complexityMultiplier}x)</span>
            <span>+{Math.round((baseCredits * duration * (complexityMultiplier - 1))).toLocaleString()} credits</span>
          </div>
        )}
        
        {demandMultiplier !== 1 && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Demand ({demandMultiplier}x)</span>
            <span>+{Math.round((baseCredits * duration * complexityMultiplier * (demandMultiplier - 1))).toLocaleString()} credits</span>
          </div>
        )}
        
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span className="text-brand-primary">{finalPrice.toLocaleString()} credits</span>
          </div>
        </div>
      </div>
    </div>
  );
}
