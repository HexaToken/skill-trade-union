import React from 'react';
import { useWalletStore } from '@/stores/wallet-store';
import { cn } from '@/lib/utils';

interface CreditBalancePillProps {
  balance?: number;
  onClick?: () => void;
  loading?: boolean;
  className?: string;
}

export function CreditBalancePill({
  balance: propBalance,
  onClick,
  loading: propLoading = false,
  className
}: CreditBalancePillProps) {
  // Use wallet store if balance not provided as prop
  const { balance: storeBalance, isLoading: storeLoading } = useWalletStore();

  const balance = propBalance ?? storeBalance;
  const loading = propLoading || storeLoading;

  return (
    <button
      onClick={onClick}
      aria-label={`Credit balance: ${balance} credits`}
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-card text-card-foreground px-3 py-1 shadow-sm hover:shadow-md transition-shadow",
        "border border-border hover:border-brand-primary/50",
        className
      )}
    >
      <span className="text-lg">🪙</span>
      <span className="font-medium">
        {loading ? "…" : balance}
      </span>
    </button>
  );
}

export default CreditBalancePill;
