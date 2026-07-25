'use client';

import { useMemo } from 'react';
import { computeDigitStats } from '@/lib/digit-stats';
import { computeTransitionMatrix } from '@/lib/transition-matrix';
import { astralSignal, type StrategyResult } from '@/lib/strategies';

export interface UseIntelligenceReturn {
  /** Current signal from the unified Astral Signal engine */
  signal: StrategyResult;
  /** Whether there is enough data to compute signals */
  hasData: boolean;
  /** Total ticks analyzed */
  totalTicks: number;
}

export interface UseIntelligenceParams {
  /** Price history from live WebSocket */
  prices: number[];
  /** Pip size for digit extraction */
  pipSize: number;
}

/**
 * Intelligence engine hook
 * Connects live tick data to the three strategy engines
 * and returns the unified Astral Signal
 */
export function useIntelligence({ prices, pipSize }: UseIntelligenceParams): UseIntelligenceReturn {
  const result = useMemo(() => {
    const digitStats = computeDigitStats(prices, pipSize);
    const signal = astralSignal(digitStats, prices, pipSize);

    return {
      signal,
      hasData: prices.length >= 10, // Need minimum data for meaningful analysis
      totalTicks: digitStats.totalTicks,
    };
  }, [prices, pipSize]);

  return result;
}
