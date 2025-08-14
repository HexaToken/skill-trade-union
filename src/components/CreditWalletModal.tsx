import React, { useState } from "react";
import { useWalletStore } from '@/stores/wallet-store';
import CreditTxnItem from './CreditTxnItem';

export function CreditWalletModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tab, setTab] = useState<'overview' | 'earn' | 'history'>('overview');
  const { balance, recentTransactions, isLoading } = useWalletStore();

  if (!open) return null;

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative mx-auto mt-16 w-[92%] max-w-3xl rounded-lg bg-card p-4 shadow-lg border border-border">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <h3 className="font-heading text-foreground text-lg">Credit Wallet</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          {(['overview', 'earn', 'history'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`px-3 py-1 rounded-full transition-colors ${
                tab === t
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {t[0].toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === 'overview' && (
            <div className="space-y-4">
              <div className="rounded-xl bg-muted/50 p-4 border border-border">
                <div className="text-sm text-muted-foreground">Current balance</div>
                <div className="text-3xl font-bold text-foreground">
                  {isLoading ? "..." : balance}
                </div>
                <div className="text-xs text-muted-foreground">
                  ≈ {Math.floor((balance || 0) / 35)} standard 30-min sessions
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Recent Transactions</h4>
                <div className="space-y-2">
                  {recentTransactions.slice(0, 5).map((tx) => (
                    <CreditTxnItem key={tx.id} tx={tx} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'earn' && (
            <div className="grid gap-3 md:grid-cols-2">
              <button className="rounded-xl bg-muted/50 p-4 text-left hover:bg-muted/70 transition-colors border border-border">
                <div className="text-foreground font-medium">Teach a session</div>
                <div className="text-muted-foreground text-sm">+10 per 30 min baseline</div>
              </button>

              <button className="rounded-xl bg-muted/50 p-4 text-left hover:bg-muted/70 transition-colors border border-border">
                <div className="text-foreground font-medium">Join Skill Sprint</div>
                <div className="text-muted-foreground text-sm">Variable rewards</div>
              </button>

              <button className="rounded-xl bg-muted/50 p-4 text-left hover:bg-muted/70 transition-colors border border-border">
                <div className="text-foreground font-medium">Refer a Friend</div>
                <div className="text-muted-foreground text-sm">+25 credits</div>
              </button>

              <button className="rounded-xl bg-muted/50 p-4 text-left hover:bg-muted/70 transition-colors border border-border">
                <div className="text-foreground font-medium">Complete Skill Test</div>
                <div className="text-muted-foreground text-sm">+5 credits per test</div>
              </button>
            </div>
          )}

          {tab === 'history' && (
            <div className="divide-y divide-border">
              {recentTransactions.map((tx) => (
                <CreditTxnItem key={tx.id} tx={tx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreditWalletModal;
