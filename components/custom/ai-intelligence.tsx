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
    <div className="space-y-4">
      {/* Main Signal - Dominant */}
      <div className="text-center py-4">
        <p className="text-3xl font-bold text-white mb-2">
          {signal.signal}
        </p>
        <div className="flex items-center justify-center gap-2">
          <p className="text-4xl font-bold text-[#00FF88]">
            {hasData ? `${signal.confidence.toFixed(0)}%` : '--'}
          </p>
          <p className={`text-xs font-semibold uppercase tracking-wider ${
            signal.isValid ? 'text-[#00FF88]' : 'text-muted-foreground'
          }`}>
            {signal.isValid ? 'Qualified' : 'Waiting'}
          </p>
        </div>
      </div>

      {/* Confidence Bar */}
      {hasData && (
        <div className="space-y-2">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Astra Confidence</p>
          <div className="flex gap-1">
            {confidenceBars.map((filled, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-sm transition-all ${
                  filled ? 'bg-[#00FF88]' : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="space-y-2 pt-3 border-t border-white/10">
        {/* Trigger */}
        {signal.isValid && signal.triggerDigit !== undefined && (
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Trigger</p>
            <p className="text-lg font-bold text-white">
              {signal.triggerDigit}
            </p>
          </div>
        )}

        {/* Target (for DIFFERS) */}
        {signal.isValid && signal.targetDigit !== undefined && (
          <div className="flex items-center justify-between">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Target</p>
            <p className="text-lg font-bold text-white">
              {signal.targetDigit}
            </p>
          </div>
        )}

        {/* Strategy */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Strategy</p>
          <p className="text-[10px] text-foreground/80">
            {signal.type === 'WAIT' ? 'None' : signal.type.replace('_', ' ')}
          </p>
        </div>

        {/* Evidence */}
        {signal.evidence && (
          <div className="pt-2">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Evidence</p>
            <p className="text-[10px] text-foreground/70 leading-relaxed">
              {signal.evidence}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
