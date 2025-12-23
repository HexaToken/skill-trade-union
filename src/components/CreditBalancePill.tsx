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
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-all",
        "bg-slate-100 text-slate-700 border-2 border-slate-300 hover:border-primary/60 hover:bg-slate-50",
        "[data-theme='dark']:bg-slate-800 [data-theme='dark']:text-slate-200 [data-theme='dark']:border-slate-600 [data-theme='dark']:hover:border-primary/60",
        className
      )}
    >
      <span className="text-lg">🪙</span>
      <span className="font-semibold">
        {loading ? "…" : balance}
      </span>
    </button>
  );
}

export default CreditBalancePill;
