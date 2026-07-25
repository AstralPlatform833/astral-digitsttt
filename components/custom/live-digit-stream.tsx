'use client';

import { Card } from '@/components/ui/card';
import type { Tick } from '@deriv/core';
import type { ActiveSymbol } from '@deriv/core';
import { getLastDigit } from '@/lib/digit-stats';

interface LiveDigitStreamProps {
  currentTick: Tick | null;
  lastDigit: number | null;
  activeSymbol: ActiveSymbol | null;
  pipSize: number;
  prices: number[];
}

const NEON_COLORS = [
  'bg-neon-pink',
  'bg-neon-cyan', 
  'bg-neon-green',
  'bg-neon-purple',
  'bg-neon-pink',
  'bg-neon-cyan',
  'bg-neon-green',
  'bg-neon-purple',
  'bg-neon-pink',
  'bg-neon-cyan',
  'bg-neon-green',
  'bg-neon-purple',
  'bg-neon-pink',
  'bg-neon-cyan',
  'bg-neon-green',
];

const GLOW_COLORS = [
  'glow-pink',
  'glow-cyan',
  'glow-green',
  'glow-purple',
  'glow-pink',
  'glow-cyan',
  'glow-green',
  'glow-purple',
  'glow-pink',
  'glow-cyan',
  'glow-green',
  'glow-purple',
  'glow-pink',
  'glow-cyan',
  'glow-green',
];

export function LiveDigitStream({ currentTick, lastDigit, activeSymbol, pipSize, prices = [] }: LiveDigitStreamProps) {
  // Extract last 15 digits from prices history
  const digitHistory = prices.slice(-15).map(price => getLastDigit(price, pipSize));
  // Add current last digit if not already in history
  const displayDigits = lastDigit !== null
    ? [...digitHistory.slice(-14), lastDigit]
    : digitHistory.slice(-15);

  // Format current tick price
  const formatPrice = (price: number) => {
    if (!activeSymbol) return (price || 0).toFixed(2);
    const decimals = pipSize === 0.01 ? 2 : pipSize === 0.001 ? 3 : pipSize === 0.0001 ? 4 : 2;
    return (price || 0).toFixed(decimals);
  };

  return (
    <div>
      {/* Current Tick Display */}
      {currentTick && (
        <div className="mb-4 bg-black/30 rounded-lg p-3 border border-white/10">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Latest Tick</p>
          <p className="text-xl font-mono font-bold text-neon-cyan">
            {formatPrice(currentTick.quote)}
          </p>
        </div>
      )}

      {/* Digit Stream - Single row on desktop, 2-row wrap on mobile */}
      <div className="flex gap-2 justify-center flex-wrap sm:flex-nowrap">
        {displayDigits.map((digit, index) => {
          const colorClass = NEON_COLORS[index % NEON_COLORS.length];
          const glowClass = GLOW_COLORS[index % GLOW_COLORS.length];
          const isLatest = index === displayDigits.length - 1;

          return (
            <div
              key={`${digit}-${index}`}
              className={`
                digit-ball w-7 h-7 sm:w-8 sm:h-8 rounded-full
                ${colorClass} ${glowClass}
                flex items-center justify-center
                text-white font-bold text-sm
                transition-all duration-300
                ${isLatest ? 'scale-110 ring-2 ring-white/50 shadow-lg shadow-white/20' : 'opacity-80'}
              `}
            >
              {digit}
            </div>
          );
        })}
      </div>
    </div>
  );
}
