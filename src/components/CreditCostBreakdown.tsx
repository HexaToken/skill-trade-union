import React from 'react';
import { AlertTriangle, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface Fee {
  label: string;
  amount?: number;
  percentage?: number;
}

interface CreditCostBreakdownProps {
  basePerHour: number;
  durationMins: number;
  complexity?: number;
  demand?: number;
  fees?: Fee[];
  balance: number;
  onEarnCreditsClick?: () => void;
  className?: string;
  compact?: boolean;
}

export default function CreditCostBreakdown({
  basePerHour,
  durationMins,
  complexity = 1.0,
  demand = 1.0,
  fees = [],
  balance,
  onEarnCreditsClick,
  className,
  compact = false
}: CreditCostBreakdownProps) {
  const durationHours = durationMins / 60;
  
  // Calculate step by step
  const baseAmount = basePerHour * durationHours;
  const afterComplexity = baseAmount * complexity;
  const afterDemand = afterComplexity * demand;
  
  // Calculate fees
  let totalFees = 0;
  const calculatedFees = fees.map(fee => {
    let feeAmount = 0;
    if (fee.amount) {
      feeAmount = fee.amount;
    } else if (fee.percentage) {
      feeAmount = afterDemand * (fee.percentage / 100);
    }
    totalFees += feeAmount;
    return { ...fee, calculatedAmount: feeAmount };
  });
  
  const finalTotal = afterDemand + totalFees;
  const isInsufficientBalance = balance < finalTotal;
  
  const formatNumber = (num: number) => {
    return Number(num.toFixed(2));
  };

  if (compact) {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Cost:</span>
          <span className="font-semibold">{formatNumber(finalTotal)} credits</span>
        </div>
        
        {isInsufficientBalance && (
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span className="text-sm">Insufficient balance</span>
              {onEarnCreditsClick && (
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={onEarnCreditsClick}
                  className="h-auto p-0 text-brand-primary"
                >
                  Earn credits
                </Button>
              )}
            </AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Cost Breakdown</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          {/* Base calculation */}
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">
              Base: {basePerHour} cr/hr × {durationHours}h
            </span>
            <span className="font-mono">{formatNumber(baseAmount)}</span>
          </div>
          
          {/* Complexity modifier */}
          {complexity !== 1.0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Complexity: × {complexity}
              </span>
              <span className="font-mono">{formatNumber(afterComplexity)}</span>
            </div>
          )}
          
          {/* Demand modifier */}
          {demand !== 1.0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">
                Demand: × {demand}
              </span>
              <span className="font-mono">{formatNumber(afterDemand)}</span>
            </div>
          )}
          
          {/* Fees */}
          {calculatedFees.map((fee, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-muted-foreground">
                {fee.label}: {fee.percentage ? `${fee.percentage}%` : 'fixed'}
              </span>
              <span className="font-mono">
                <Plus className="w-3 h-3 inline mr-1" />
                {formatNumber(fee.calculatedAmount)}
              </span>
            </div>
          ))}
        </div>
        
        {/* Divider */}
        <div className="border-t border-border" />
        
        {/* Total */}
        <div className="flex items-center justify-between">
          <span className="font-semibold">Total:</span>
          <span className="text-lg font-bold">{formatNumber(finalTotal)} credits</span>
        </div>
        
        {/* Balance check */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Your balance:</span>
          <span className={cn(
            "font-medium",
            isInsufficientBalance ? "text-red-600" : "text-emerald-600"
          )}>
            {balance} credits
          </span>
        </div>
        
        {/* Insufficient balance warning */}
        {isInsufficientBalance && (
          <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>
                  You need {formatNumber(finalTotal - balance)} more credits
                </span>
                {onEarnCreditsClick && (
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={onEarnCreditsClick}
                    className="h-auto p-0 text-brand-primary"
                  >
                    Earn credits
                  </Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Remaining balance after transaction */}
        {!isInsufficientBalance && (
          <div className="text-xs text-muted-foreground">
            After this transaction: {formatNumber(balance - finalTotal)} credits remaining
          </div>
        )}
      </CardContent>
    </Card>
  );
}
