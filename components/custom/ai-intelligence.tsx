'use client';

import type { StrategyResult } from '@/lib/strategies';

interface AISignalProps {
  signal: StrategyResult;
  hasData: boolean;
  isConnected?: boolean;
}

export function AISignal({ signal, hasData, isConnected = false }: AISignalProps) {
  const getConfidenceBars = () => {
    if (!hasData) return Array(10).fill(false);
    const percentage = Math.min(signal.confidence, 100);
    const filled = Math.round(percentage / 10);
    return Array(10).fill(0).map((_, i) => i < filled);
  };

  const confidenceBars = getConfidenceBars();

  return (
    <div className="space-y-3">
      {/* Main Signal - Dominant */}
      <div className="text-center py-2">
        <p className="text-xl font-bold text-white mb-1">
          {signal.signal}
        </p>
        <div className="flex items-center justify-center gap-2">
          <p className="text-2xl font-bold text-[#00FF88]">
            {hasData ? `${signal.confidence.toFixed(0)}%` : '--'}
          </p>
          <p className={`text-[10px] font-semibold uppercase tracking-wider ${
            signal.isValid ? 'text-[#00FF88]' : 'text-muted-foreground'
          }`}>
            {signal.isValid ? 'Qualified' : 'Waiting'}
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      {hasData && (
        <div className="space-y-1">
          <div className="flex gap-0.5">
            {confidenceBars.map((filled, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-sm transition-all ${
                  filled ? 'bg-[#00FF88]' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Details - Compact */}
      <div className="space-y-1.5 pt-2 border-t border-white/10">
        {/* Trigger */}
        {signal.isValid && signal.triggerDigit !== undefined && (
          <div className="flex items-center justify-between">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Trigger</p>
            <p className="text-sm font-bold text-white">
              {signal.triggerDigit}
            </p>
          </div>
        )}

        {/* Target (for DIFFERS) */}
        {signal.isValid && signal.targetDigit !== undefined && (
          <div className="flex items-center justify-between">
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Target</p>
            <p className="text-sm font-bold text-white">
              {signal.targetDigit}
            </p>
          </div>
        )}

        {/* Strategy */}
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider">Strategy</p>
          <p className="text-[9px] text-foreground/80">
            {signal.type === 'WAIT' ? 'None' : signal.type.replace('_', ' ')}
          </p>
        </div>

        {/* Evidence */}
        {signal.evidence && (
          <div className="pt-1">
            <p className="text-[9px] text-foreground/60 leading-tight">
              {signal.evidence}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
