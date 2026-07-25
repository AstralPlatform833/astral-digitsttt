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
    <Card className="astral-glass border-glow-cyan p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-green flex items-center justify-center text-white font-bold text-sm glow-cyan">
          📊
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
          Live Digit Stream
        </h3>
      </div>

      {/* Current Tick Display */}
      {currentTick && (
        <div className="mb-4 bg-black/30 rounded-lg p-3 border border-white/10">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Latest Tick</p>
          <p className="text-lg font-mono font-bold text-neon-cyan">
            {formatPrice(currentTick.quote)}
          </p>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2">
        {displayDigits.map((digit, index) => {
          const colorClass = NEON_COLORS[index % NEON_COLORS.length];
          const glowClass = GLOW_COLORS[index % GLOW_COLORS.length];
          const isLatest = index === displayDigits.length - 1;
          
          return (
            <div
              key={`${digit}-${index}`}
              className={`
                digit-ball flex-shrink-0 w-10 h-10 rounded-full 
                ${colorClass} ${glowClass}
                flex items-center justify-center 
                text-white font-bold text-sm
                ${isLatest ? 'scale-110 ring-2 ring-white/50' : ''}
              `}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >
              {digit}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-muted-foreground mt-2 text-center">Last 15 digits</p>
    </Card>
  );
}
