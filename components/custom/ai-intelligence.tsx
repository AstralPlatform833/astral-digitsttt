'use client';

import { Card } from '@/components/ui/card';

interface AISignalProps {
  selectedDigit?: number;
  isConnected?: boolean;
}

export function AISignal({ selectedDigit = 0, isConnected = false }: AISignalProps) {
  return (
    <Card className="astral-glass border-glow-purple p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-white font-bold text-xs glow-purple">
          🧠
        </div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Astral Signal
        </h3>
      </div>

      {/* Prediction */}
      <div className="mb-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Prediction</p>
        <p className="text-lg font-bold text-neon-purple">
          Digit {selectedDigit}
        </p>
      </div>

      {/* Confidence */}
      <div className="mb-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Confidence</p>
        <p className="text-sm font-bold text-neon-cyan">
          {isConnected ? '82%' : '--'}
        </p>
      </div>

      {/* Strategy */}
      <div className="mb-2">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Strategy</p>
        <p className="text-xs text-foreground/80">
          Matrix + Frequency
        </p>
      </div>

      {/* Status */}
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Status</p>
        <p className="text-xs font-semibold text-neon-green">
          {isConnected ? 'Strong setup' : 'Waiting for data'}
        </p>
      </div>
    </Card>
  );
}
