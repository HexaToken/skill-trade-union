import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  RotateCcw, 
  Link2, 
  ChevronDown, 
  ChevronUp,
  Calendar,
  User,
  BookOpen
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type TransactionType = 'earn' | 'spend' | 'adjust' | 'escrow' | 'refund';

interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  subtitle?: string;
  amount: number;
  balanceAfter: number;
  timestamp: string;
  skill?: string;
  partnerName?: string;
  details?: {
    baseAmount?: number;
    complexity?: number;
    demand?: number;
    fees?: Array<{ label: string; amount: number }>;
    sessionLink?: string;
    receiptLink?: string;
  };
}

interface CreditTxnItemProps {
  transaction: Transaction;
  className?: string;
}

export default function CreditTxnItem({ transaction, className }: CreditTxnItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'earn':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'spend':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'adjust':
        return <RotateCcw className="w-4 h-4 text-blue-600" />;
      case 'escrow':
        return <Link2 className="w-4 h-4 text-amber-600" />;
      case 'refund':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      default:
        return <RotateCcw className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAmountDisplay = (amount: number, type: TransactionType) => {
    const isPositive = amount > 0;
    const displayAmount = Math.abs(amount);
    
    return (
      <span className={cn(
        "font-semibold",
        isPositive ? "text-emerald-600" : "text-red-600"
      )}>
        {isPositive ? '+' : '−'}{displayAmount}
      </span>
    );
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">
              {getTypeIcon(transaction.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-foreground truncate">
                  {transaction.title}
                </h4>
                {transaction.skill && (
                  <Badge variant="secondary" size="sm">
                    {transaction.skill}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>{formatTimestamp(transaction.timestamp)}</span>
                
                {transaction.partnerName && (
                  <>
                    <span>•</span>
                    <User className="w-3 h-3" />
                    <span>{transaction.partnerName}</span>
                  </>
                )}
              </div>
              
              {transaction.subtitle && (
                <p className="text-sm text-muted-foreground mt-1">
                  {transaction.subtitle}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-right">
              <div className="text-lg">
                {getAmountDisplay(transaction.amount, transaction.type)}
              </div>
              <div className="text-xs text-muted-foreground">
                Balance: {transaction.balanceAfter}
              </div>
            </div>
            
            <Button variant="ghost" size="sm">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
        
        {isExpanded && transaction.details && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="space-y-2">
              <h5 className="font-medium text-sm text-foreground">Transaction Details</h5>
              
              {transaction.details.baseAmount && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base amount:</span>
                  <span>{transaction.details.baseAmount} credits</span>
                </div>
              )}
              
              {transaction.details.complexity && transaction.details.complexity !== 1 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Complexity modifier:</span>
                  <span>×{transaction.details.complexity}</span>
                </div>
              )}
              
              {transaction.details.demand && transaction.details.demand !== 1 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Demand modifier:</span>
                  <span>×{transaction.details.demand}</span>
                </div>
              )}
              
              {transaction.details.fees && transaction.details.fees.length > 0 && (
                <>
                  {transaction.details.fees.map((fee, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{fee.label}:</span>
                      <span>{fee.amount > 0 ? '+' : ''}{fee.amount}</span>
                    </div>
                  ))}
                </>
              )}
              
              <div className="flex justify-between text-sm font-medium pt-2 border-t border-border">
                <span>Total:</span>
                <span>{Math.abs(transaction.amount)} credits</span>
              </div>
              
              <div className="flex gap-2 mt-3">
                {transaction.details.sessionLink && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={transaction.details.sessionLink}>
                      <BookOpen className="w-3 h-3 mr-1" />
                      View Session
                    </a>
                  </Button>
                )}
                
                {transaction.details.receiptLink && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={transaction.details.receiptLink}>
                      <Link2 className="w-3 h-3 mr-1" />
                      Receipt
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
