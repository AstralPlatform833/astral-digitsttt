'use client';

import { Card } from '@/components/ui/card';
import type { OpenPosition } from '@/hooks/use-open-positions';

interface TradeStatusProps {
  openPositions: OpenPosition[];
  isBuying: boolean;
}

export function TradeStatus({ openPositions, isBuying }: TradeStatusProps) {
  // Get the most recent open position (running contract)
  const runningContract = openPositions.length > 0 ? openPositions[openPositions.length - 1] : undefined;

  if (isBuying || (runningContract && runningContract.status === 'open' && !runningContract.is_sold && !runningContract.is_expired)) {
    return (
      <Card className="astral-glass border-glow-yellow p-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
          <span className="text-xs font-semibold text-yellow-400">Running...</span>
        </div>
      </Card>
    );
  }

  if (!runningContract) {
    return (
      <Card className="astral-glass border-glow-gray p-3">
        <span className="text-xs text-muted-foreground">No recent trades</span>
      </Card>
    );
  }

  // Use real profit from the contract
  const profit = parseFloat(runningContract.profit || '0');
  const isWin = profit > 0;
  const isLoss = profit < 0;

  return (
    <Card className={`astral-glass p-3 ${isWin ? 'border-glow-green' : isLoss ? 'border-glow-pink' : 'border-glow-gray'}`}>
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isWin ? 'bg-green-400' : isLoss ? 'bg-red-400' : 'bg-gray-400'}`} />
        <div className="flex flex-col">
          <span className={`text-xs font-semibold ${isWin ? 'text-green-400' : isLoss ? 'text-red-400' : 'text-gray-400'}`}>
            {isWin ? 'WON' : isLoss ? 'LOST' : 'CLOSED'}
          </span>
          <span className={`text-xs font-mono ${isWin ? 'text-green-300' : isLoss ? 'text-red-300' : 'text-gray-300'}`}>
            {profit >= 0 ? '+' : ''}{profit.toFixed(2)} {runningContract.currency}
          </span>
        </div>
      </div>
    </Card>
  );
}
