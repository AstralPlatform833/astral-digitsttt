'use client';

import type { DigitStats } from '@/lib/types';
import { computeTransitionMatrix } from '@/lib/transition-matrix';

interface TransitionMatrixProps {
  digitStats: DigitStats;
  prices: number[];
  pipSize: number;
}

export function TransitionMatrix({ digitStats, prices, pipSize }: TransitionMatrixProps) {
  // Compute real transition matrix from price history
  const { matrix, rowTotals, totalTransitions } = computeTransitionMatrix(prices, pipSize);

  const getHeatmapColor = (probability: number) => {
    if (probability > 20) return 'bg-neon-pink/80';
    if (probability > 15) return 'bg-neon-cyan/80';
    if (probability > 12) return 'bg-neon-green/80';
    if (probability > 8) return 'bg-neon-purple/60';
    if (probability > 5) return 'bg-neon-pink/40';
    return 'bg-white/10';
  };

  const getGlowClass = (probability: number) => {
    if (probability > 20) return 'glow-pink';
    if (probability > 15) return 'glow-cyan';
    if (probability > 12) return 'glow-green';
    return '';
  };

  if (totalTransitions < 10) {
    return (
      <div className="flex items-center justify-center h-16 text-xs text-muted-foreground">
        Collecting data...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-10 gap-0.5">
      {matrix.map((row, rowIndex) =>
        row.map((probability, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`
              aspect-square rounded-sm flex items-center justify-center
              text-[10px] font-bold text-white
              ${getHeatmapColor(probability)}
              ${getGlowClass(probability)}
              transition-all duration-300 hover:scale-110 hover:z-10 cursor-pointer
            `}
            title={`After ${rowIndex} → ${colIndex}: ${probability.toFixed(1)}% (${rowTotals[rowIndex]} samples)`}
          >
            {probability.toFixed(0)}
          </div>
        ))
      )}
    </div>
  );
}
