'use client';

import type { StrategyResult } from '@/lib/strategies';

interface AISignalProps {
  signal: StrategyResult;
  hasData: boolean;
  isConnected?: boolean;
}

export function AISignal({ signal, hasData, isConnected = false }: AISignalProps) {
  return (
    <div className="space-y-3">
      {/* Signal */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Signal</p>
        <p className="text-sm font-bold text-neon-purple text-right">
          {signal.signal}
        </p>
      </div>

      {/* Confidence */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Confidence</p>
        <p className="text-sm font-bold text-neon-cyan">
          {hasData ? `${signal.confidence.toFixed(0)}%` : '--'}
        </p>
      </div>

      {/* Strategy */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Strategy</p>
        <p className="text-[10px] text-foreground/80">
          {signal.type === 'WAIT' ? 'None' : signal.type.replace('_', ' ')}
        </p>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Status</p>
        <p className={`text-[10px] font-semibold ${signal.isValid ? 'text-neon-green' : 'text-muted-foreground'}`}>
          {!hasData ? 'Collecting' : signal.isValid ? 'Qualified' : 'Waiting'}
        </p>
      </div>

      {/* Trigger (if valid) */}
      {signal.isValid && signal.triggerDigit !== undefined && (
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Trigger</p>
          <p className="text-[10px] font-bold text-foreground">
            {signal.triggerDigit}
          </p>
        </div>
      )}

      {/* Target (for DIFFERS) */}
      {signal.isValid && signal.targetDigit !== undefined && (
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Differ</p>
          <p className="text-[10px] font-bold text-foreground">
            {signal.targetDigit}
          </p>
        </div>
      )}
    </div>
  );
}
