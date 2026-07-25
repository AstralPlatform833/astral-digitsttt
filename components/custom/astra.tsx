'use client';

import type { StrategyResult } from '@/lib/strategies';

interface AstraProps {
  signal: StrategyResult;
  hasData: boolean;
  isConnected?: boolean;
}

export function Astra({ signal, hasData, isConnected = false }: AstraProps) {
  const getMessage = () => {
    if (!hasData) {
      return "I'm collecting data from the live stream. Give me a moment to build the distribution and transition matrix.";
    }

    if (!signal.isValid) {
      return "I'm watching 👀. None of the three strategies has a complete setup yet.";
    }

    switch (signal.type) {
      case 'OVER_1':
        return `I've detected an OVER 1 setup after ${signal.triggerDigit}. Digits 0 and 1 are below the 10.5% threshold and the transition matrix confirms the setup.`;
      case 'UNDER_8':
        return `I've detected an UNDER 8 setup after ${signal.triggerDigit}. Digits 8 and 9 are below the 10.5% threshold and the transition matrix confirms the setup.`;
      case 'DIFFERS':
        return `I've detected a DIFFERS ${signal.targetDigit} setup after ${signal.triggerDigit}. The transition matrix shows this is a rare transition with strong evidence.`;
      default:
        return "I'm watching 👀. None of the three strategies has a complete setup yet.";
    }
  };

  return (
    <div className="space-y-3">
      {/* Astra Avatar & Status */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-xl glow-purple">
            🐻
          </div>
          {isConnected && (
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-neon-green rounded-full border-2 border-background" />
          )}
        </div>
        <div className="flex-1">
          <p className="text-xs font-bold text-foreground">Astra</p>
          <p className="text-[10px] text-muted-foreground">
            {isConnected ? '● Live' : '○ Offline'}
          </p>
        </div>
      </div>

      {/* Astra Message */}
      <div className="bg-white/5 rounded-lg p-3 border border-white/10">
        <p className="text-xs text-foreground/90 leading-relaxed">
          {getMessage()}
        </p>
      </div>

      {/* Signal Explanation (if valid) */}
      {signal.isValid && signal.evidence && (
        <div className="text-[10px] text-muted-foreground">
          <p className="font-semibold mb-1">Evidence:</p>
          <p>{signal.evidence}</p>
        </div>
      )}
    </div>
  );
}
