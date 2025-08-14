import React from 'react';

type Line = { label: string; value: number; calc?: string };

export function CreditCostBreakdown({ lines, total }: { lines: Line[]; total: number }) {
  return (
    <div className="rounded-lg bg-card p-4 text-sm border border-border">
      <ul className="space-y-1">
        {lines.map((l, i) => (
          <li key={i} className="flex justify-between">
            <span className="text-muted-foreground">
              {l.label}
              {l.calc ? (
                <span className="ml-1 text-xs text-muted-foreground/70">
                  ({l.calc})
                </span>
              ) : null}
            </span>
            <span className="text-foreground">{l.value}</span>
          </li>
        ))}
      </ul>
      <div className="mt-3 pt-3 border-t border-border flex justify-between font-semibold">
        <span className="text-foreground">Total</span>
        <span className="text-foreground">{total}</span>
      </div>
    </div>
  );
}

export default CreditCostBreakdown;
