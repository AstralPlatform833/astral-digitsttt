'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import type { DigitStats } from '../lib/types';

interface DigitStatsBarProps {
  digitStats: DigitStats;
  selectedDigit: number;
  onDigitSelect: (digit: number) => void;
}

export function DigitStatsBar({
  digitStats,
  selectedDigit,
  onDigitSelect,
}: DigitStatsBarProps) {
  const maxPct = Math.max(...digitStats.percentages);
  const minPct = Math.min(...digitStats.percentages);

  return (
    <div className="h-full flex flex-col min-h-0">
      <span className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3 uppercase tracking-wider">
        Digit Distribution
      </span>
      <div className="flex-1 flex items-center min-h-0">
        <div className="grid grid-cols-5 gap-2 sm:gap-3 place-items-center w-full">
        {digitStats.percentages.map((pct, digit) => {
          const isSelected = digit === selectedDigit;
          const isHighest = digitStats.totalTicks > 0 && pct === maxPct;
          const isLowest = digitStats.totalTicks > 0 && pct === minPct;

          return (
            <div key={digit} className="flex flex-col items-center gap-1.5 sm:gap-2">
              <Button
                variant={isSelected ? 'default' : 'outline'}
                onClick={() => onDigitSelect(digit)}
                className={cn(
                  'w-11 h-11 sm:w-14 sm:h-14 text-base sm:text-xl font-semibold rounded-xl p-0 astral-transition',
                  !isSelected && 'bg-white/5 border-white/10 hover:bg-neon-cyan/20 hover:border-neon-cyan/50',
                  isSelected && 'bg-gradient-to-br from-neon-cyan to-neon-green border-0 text-black glow-cyan'
                )}
              >
                {digit}
              </Button>
              <span
                className={cn(
                  'text-xs font-mono',
                  isHighest && 'text-neon-green font-semibold',
                  isLowest && 'text-neon-pink font-semibold',
                  !isHighest && !isLowest && 'text-muted-foreground'
                )}
              >
                {pct.toFixed(1)}%
              </span>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
