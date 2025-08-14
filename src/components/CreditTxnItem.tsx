import React from 'react';
import { type Transaction } from '@/services/credit-api';

export function CreditTxnItem({ tx }: { tx: Transaction }) {
  const sign = tx.amount >= 0 ? '+' : '−';
  const tone = tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400';
  const icon = tx.type === 'earn' ? '⬆️' : tx.type === 'spend' ? '⬇️' : tx.type === 'hold' ? '⛓️' : '↩️';

  return (
    <div className="flex items-center justify-between py-3 border-b border-border">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 grid place-items-center rounded-full bg-muted">
          {icon}
        </div>
        <div>
          <div className="text-foreground">{tx.title}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(tx.at).toLocaleString()}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className={`font-semibold ${tone}`}>
          {sign}{Math.abs(tx.amount)}
        </div>
        <div className="text-xs text-muted-foreground">
          bal {tx.balanceAfter}
        </div>
      </div>
    </div>
  );
}

export default CreditTxnItem;
