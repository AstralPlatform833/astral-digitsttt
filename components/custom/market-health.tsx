'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { DigitStats } from '@/lib/types';
import { computeTransitionMatrix } from '@/lib/transition-matrix';

interface MarketHealthProps {
  digitStats: DigitStats;
  prices: number[];
  pipSize: number;
}

function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}

/**
 * Market Health — a presentation-only summary of current conditions.
 * Every metric is DERIVED from data already computed upstream
 * (digit distribution + price history). No trading logic, strategies, or
 * engine state are touched here; this purely visualizes existing signals.
 */
export function MarketHealth({ digitStats, prices, pipSize }: MarketHealthProps) {
  const health = useMemo(() => {
    const pcts = digitStats.percentages;
    if (!pcts || pcts.length === 0 || digitStats.totalTicks < 10) return null;

    // Distribution Balance — how close the digit spread is to uniform (10% each).
    const avgDev = pcts.reduce((s, p) => s + Math.abs(p - 10), 0) / pcts.length;
    const distributionBalance = clamp(100 - avgDev * 6);

    // Trend Stability — a tighter gap between most/least frequent reads as steadier.
    const spread = Math.max(...pcts) - Math.min(...pcts);
    const trendStability = clamp(100 - spread * 3);

    // Transition Reliability — how much predictive edge exists in the transition
    // matrix, weighted by how many samples back it.
    const { matrix, totalTransitions } = computeTransitionMatrix(prices, pipSize);
    let strongest = 0;
    for (const row of matrix) for (const p of row) if (p > strongest) strongest = p;
    const edge = clamp((strongest - 10) * 4);
    const sampleFactor = clamp((totalTransitions / 500) * 100);
    const transitionReliability = clamp(edge * 0.6 + sampleFactor * 0.4);

    const overall = (distributionBalance + trendStability + transitionReliability) / 3;
    const noise = clamp(100 - distributionBalance);

    return { distributionBalance, trendStability, transitionReliability, overall, noise };
  }, [digitStats, prices, pipSize]);

  if (!health) {
    return (
      <div className="flex h-24 items-center justify-center text-xs text-muted-foreground">
        Collecting data...
      </div>
    );
  }

  const rating =
    health.overall >= 75
      ? { label: 'Excellent', color: 'text-neon-green' }
      : health.overall >= 55
        ? { label: 'Good', color: 'text-neon-cyan' }
        : health.overall >= 40
          ? { label: 'Fair', color: 'text-yellow-400' }
          : { label: 'Weak', color: 'text-neon-pink' };

  const noise =
    health.noise < 30
      ? { label: 'Low', color: 'text-neon-green' }
      : health.noise < 55
        ? { label: 'Medium', color: 'text-yellow-400' }
        : { label: 'High', color: 'text-neon-pink' };

  const metrics = [
    { label: 'Trend Stability', value: health.trendStability },
    { label: 'Distribution Balance', value: health.distributionBalance },
    { label: 'Transition Reliability', value: health.transitionReliability },
  ];

  const barColor = (v: number) =>
    v >= 70 ? 'bg-neon-green' : v >= 45 ? 'bg-neon-cyan' : 'bg-neon-pink';

  return (
    <div className="space-y-3">
      <p className={cn('text-2xl font-bold', rating.color)}>{rating.label}</p>

      <div className="space-y-2.5">
        {metrics.map((m) => (
          <div key={m.label} className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground">{m.label}</span>
              <span className="text-[11px] font-semibold tabular-nums text-foreground">
                {Math.round(m.value)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className={cn('h-full rounded-full transition-all duration-500', barColor(m.value))}
                style={{ width: `${m.value}%` }}
              />
            </div>
          </div>
        ))}

        <div className="flex items-center justify-between border-t border-white/10 pt-2">
          <span className="text-[11px] text-muted-foreground">Noise Level</span>
          <span className={cn('text-[11px] font-semibold', noise.color)}>{noise.label}</span>
        </div>
      </div>
    </div>
  );
}
