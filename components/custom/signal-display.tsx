'use client';

import { Card } from '@/components/ui/card';

interface SignalDisplayProps {
  tradeType?: string;
  contractMode?: string;
  selectedDigit?: number;
}

export function SignalDisplay({ tradeType = 'matches-differs', contractMode = 'DIGITMATCH', selectedDigit = 0 }: SignalDisplayProps) {
  const getSignalText = () => {
    if (contractMode === 'DIGITMATCH') return `MATCH ${selectedDigit}`;
    if (contractMode === 'DIGITDIFF') return `DIFFER ${selectedDigit}`;
    if (contractMode === 'DIGITOVER') return `OVER ${selectedDigit}`;
    if (contractMode === 'DIGITUNDER') return `UNDER ${selectedDigit}`;
    if (contractMode === 'DIGITEVEN') return 'EVEN';
    if (contractMode === 'DIGITODD') return 'ODD';
    return contractMode;
  };

  return (
    <Card className="astral-glass border-glow-cyan p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-green flex items-center justify-center text-white font-bold text-sm glow-cyan">
          ⚡
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
          Astral Signal
        </h3>
      </div>

      {/* Signal Display */}
      <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl p-4 mb-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Current Signal</p>
        <p className="text-2xl font-bold text-neon-cyan">
          {getSignalText()}
        </p>
      </div>

      {/* Confidence Placeholder */}
      <div className="bg-neon-purple/10 border border-neon-purple/30 rounded-xl p-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Strategy</p>
          <p className="text-lg font-bold text-neon-purple">
            READY
          </p>
        </div>
        <p className="text-xs text-foreground/60">
          Signal display ready for strategy integration
        </p>
      </div>
    </Card>
  );
}
