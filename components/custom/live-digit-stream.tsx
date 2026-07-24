'use client';

import { Card } from '@/components/ui/card';
import type { Tick } from '@deriv/core';

interface LiveDigitStreamProps {
  currentTick: Tick | null;
  lastDigit: number | null;
  tickHistory?: number[];
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

export function LiveDigitStream({ currentTick, lastDigit, tickHistory = [] }: LiveDigitStreamProps) {
  // Generate 15 digits for display (last digit + history + placeholders)
  const displayDigits = [...tickHistory.slice(-14), lastDigit ?? 0].slice(-15);
  
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

      <div className="flex gap-2 overflow-x-auto pb-2">
        {displayDigits.map((digit, index) => {
          const colorClass = NEON_COLORS[index % NEON_COLORS.length];
          const glowClass = GLOW_COLORS[index % GLOW_COLORS.length];
          const isLatest = index === displayDigits.length - 1;
          
          return (
            <div
              key={`${digit}-${index}`}
              className={`
                digit-ball flex-shrink-0 w-12 h-12 rounded-full 
                ${colorClass} ${glowClass}
                flex items-center justify-center 
                text-white font-bold text-lg
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

      {/* Current Price Display */}
      {currentTick && (
        <div className="mt-4 bg-black/30 rounded-lg p-3 border border-white/10">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Current Price</p>
          <p className="text-xl font-mono font-bold text-neon-cyan">
            {currentTick.quote.toFixed(2)}
          </p>
        </div>
      )}
    </Card>
  );
}
