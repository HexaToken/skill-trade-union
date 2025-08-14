import React from 'react';
import { Coins, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CreditBalancePillProps {
  balance: number;
  isLoading?: boolean;
  isLowBalance?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function CreditBalancePill({ 
  balance, 
  isLoading = false, 
  isLowBalance = false, 
  onClick,
  className 
}: CreditBalancePillProps) {
  const formatBalance = (amount: number) => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}k`;
    }
    return amount.toString();
  };

  const pill = (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 h-9 px-3 rounded-full border transition-all duration-200",
        "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600",
        "hover:bg-slate-50 dark:hover:bg-slate-700",
        "text-slate-700 dark:text-slate-200",
        "shadow-sm hover:shadow-md",
        className
      )}
      aria-label={`Credit balance: ${balance} credits`}
    >
      <div className="flex items-center gap-1.5">
        {isLowBalance && (
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
        )}
        
        <Coins className="w-4 h-4 text-brand-primary" />
        
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
        ) : (
          <span className="font-semibold text-sm">
            {formatBalance(balance)}
          </span>
        )}
      </div>
    </Button>
  );

  if (isLowBalance) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {pill}
          </TooltipTrigger>
          <TooltipContent>
            <p>Low balance - consider earning more credits</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return pill;
}
