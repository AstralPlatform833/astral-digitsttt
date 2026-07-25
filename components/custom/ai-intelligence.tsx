'use client';

import { Card } from '@/components/ui/card';

interface AISignalProps {
  selectedDigit?: number;
  isConnected?: boolean;
}

export function AISignal({ selectedDigit = 0, isConnected = false }: AISignalProps) {
  return (
    <Card className="astral-glass border-glow-purple p-3 md:col-span-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 rounded bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-white font-bold text-xs glow-purple">
          🧠
        </div>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-foreground">
          Astral Signal
        </h3>
      </div>

      <div className="space-y-2">
        {/* Prediction */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Prediction</p>
          <p className="text-sm font-bold text-neon-purple">
            {selectedDigit}
          </p>
        </div>

        {/* Confidence */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Confidence</p>
          <p className="text-xs font-bold text-neon-cyan">
            {isConnected ? '82%' : '--'}
          </p>
        </div>

        {/* Strategy */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Strategy</p>
          <p className="text-[10px] text-foreground/80">
            Matrix + Freq
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</p>
          <p className="text-[10px] font-semibold text-neon-green">
            {isConnected ? 'Strong' : 'Waiting'}
          </p>
        </div>
      </div>
    </Card>
  );
}
