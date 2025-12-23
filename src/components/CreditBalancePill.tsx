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
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-all border-2",
        className
      )}
      style={{
        backgroundColor: 'var(--credit-pill-bg, #F1F5F9)',
        color: 'var(--credit-pill-text, #334155)',
        borderColor: 'var(--credit-pill-border, #CBD5E1)'
      }}
    >
      <span className="text-lg">🪙</span>
      <span className="font-semibold">
        {loading ? "…" : balance}
      </span>
    </button>
  );
}

export default CreditBalancePill;
