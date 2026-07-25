'use client';

interface AISignalProps {
  selectedDigit?: number;
  isConnected?: boolean;
}

export function AISignal({ selectedDigit = 0, isConnected = false }: AISignalProps) {
  return (
    <div className="space-y-3">
      {/* Prediction */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Prediction</p>
        <p className="text-lg font-bold text-neon-purple">
          {selectedDigit}
        </p>
      </div>

      {/* Confidence */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Confidence</p>
        <p className="text-sm font-bold text-neon-cyan">
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
  );
}
