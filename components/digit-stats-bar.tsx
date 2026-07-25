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
    <div className="flex items-center justify-center">
      <div className="flex gap-2 justify-center">
        {digitStats.percentages.map((pct, digit) => {
          const isSelected = digit === selectedDigit;
          const isHighest = digitStats.totalTicks > 0 && pct === maxPct;
          const isLowest = digitStats.totalTicks > 0 && pct === minPct;
          const isLastDigit = lastDigit !== null && digit === lastDigit;

          return (
            <div key={digit} className="flex flex-col items-center gap-0.5">
              <button
                onClick={() => onDigitSelect(digit)}
                className={cn(
                  'w-8 h-8 text-xs font-semibold rounded-lg p-0 astral-transition flex items-center justify-center',
                  !isSelected && 'bg-white/5 border border-white/10 hover:bg-neon-cyan/20 hover:border-neon-cyan/50 text-foreground',
                  isSelected && 'bg-gradient-to-br from-neon-cyan to-neon-green border-0 text-black glow-cyan',
                  isLastDigit && !isSelected && 'ring-2 ring-neon-purple ring-offset-2 ring-offset-black'
                )}
              >
                {digit}
              </button>
              <span
                className={cn(
                  'text-[9px] font-mono',
                  isHighest && 'text-neon-green font-semibold',
                  isLowest && 'text-neon-pink font-semibold',
                  !isHighest && !isLowest && 'text-muted-foreground',
                  isLastDigit && 'text-neon-purple font-bold'
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
