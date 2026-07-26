'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DigitStats } from '../lib/types';

interface DigitStatsBarProps {
  digitStats: DigitStats;
  selectedDigit: number;
  onDigitSelect: (digit: number) => void;
  lastDigit?: number | null;
}

export function DigitStatsBar({
  digitStats,
  selectedDigit,
  onDigitSelect,
  lastDigit,
}: DigitStatsBarProps) {
  const maxPct = Math.max(...digitStats.percentages);
  const minPct = Math.min(...digitStats.percentages);

  return (
    <div className="flex items-end justify-center">
      <div className="grid w-full max-w-2xl grid-cols-10 gap-1.5 sm:gap-2">
        {digitStats.percentages.map((pct, digit) => {
          const isSelected = digit === selectedDigit;
          const isHighest = digitStats.totalTicks > 0 && pct === maxPct;
          const isLowest = digitStats.totalTicks > 0 && pct === minPct;
          const isLastDigit = lastDigit !== null && digit === lastDigit;
          // Bar height relative to the strongest digit, so the distribution
          // reads at a glance. Guard against divide-by-zero before any ticks.
          const barPct = maxPct > 0 ? Math.max(6, Math.round((pct / maxPct) * 100)) : 6;

          return (
            <div key={digit} className="flex flex-col items-center gap-1">
              {/* Frequency bar */}
              <div className="flex h-10 w-full items-end justify-center">
                <div
                  className={cn(
                    'w-full max-w-[18px] rounded-t-sm transition-all duration-300',
                    isHighest && 'bg-neon-green/80',
                    isLowest && !isHighest && 'bg-neon-pink/70',
                    !isHighest && !isLowest && 'bg-white/15'
                  )}
                  style={{ height: `${barPct}%` }}
                />
              </div>
              <button
                onClick={() => onDigitSelect(digit)}
                className={cn(
                  'flex h-8 w-full max-w-[34px] items-center justify-center rounded-lg p-0 text-xs font-semibold astral-transition',
                  !isSelected &&
                    'border border-white/10 bg-white/5 text-foreground hover:border-neon-cyan/50 hover:bg-neon-cyan/20',
                  isSelected &&
                    'border-0 bg-gradient-to-br from-neon-cyan to-neon-green text-black glow-cyan',
                  isLastDigit && !isSelected && 'ring-2 ring-neon-purple ring-offset-2 ring-offset-black'
                )}
              >
                {digit}
              </button>
              <span
                className={cn(
                  'font-mono text-[9px] tabular-nums',
                  isHighest && 'font-semibold text-neon-green',
                  isLowest && 'font-semibold text-neon-pink',
                  !isHighest && !isLowest && 'text-muted-foreground',
                  isLastDigit && 'font-bold text-neon-purple'
                )}
              >
                {pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
