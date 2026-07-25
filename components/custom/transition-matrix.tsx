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

  // Find current trigger digit (last digit from prices)
  const getLastDigit = (price: number, pip: number): number => {
    const digit = Math.floor((price / pip) % 10);
    return digit < 0 ? -digit : digit;
  };
  const currentTrigger = prices.length > 0 ? getLastDigit(prices[prices.length - 1], pipSize) : null;

  // Find strongest probability in the matrix
  let strongestProb = 0;
  let strongestCell = { row: -1, col: -1 };
  matrix.forEach((row, rowIndex) => {
    row.forEach((prob, colIndex) => {
      if (prob > strongestProb) {
        strongestProb = prob;
        strongestCell = { row: rowIndex, col: colIndex };
      }
    });
  });

  const getHeatmapColor = (probability: number) => {
    if (probability > 25) return 'bg-[#A855F7]/90';
    if (probability > 20) return 'bg-[#22D3EE]/90';
    if (probability > 15) return 'bg-[#00FF88]/90';
    if (probability > 10) return 'bg-[#A855F7]/70';
    if (probability > 5) return 'bg-[#22D3EE]/50';
    return 'bg-white/10';
  };

  const getGlowClass = (probability: number) => {
    if (probability > 25) return 'glow-purple';
    if (probability > 20) return 'glow-cyan';
    if (probability > 15) return 'glow-green';
    return '';
  };

  if (totalTransitions < 10) {
    return (
      <div className="flex items-center justify-center h-20 text-xs text-muted-foreground">
        Collecting data...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {/* Column Labels */}
      <div className="flex pl-4">
        {matrix[0].map((_, colIndex) => (
          <div key={colIndex} className="flex-1 text-center text-[9px] text-muted-foreground font-mono">
            {colIndex}
          </div>
        ))}
      </div>

      {/* Matrix Grid */}
      <div className="flex gap-0.5">
        {/* Row Labels */}
        <div className="flex flex-col justify-center pr-1">
          {matrix.map((_, rowIndex) => (
            <div key={rowIndex} className="h-[22px] flex items-center text-[9px] text-muted-foreground font-mono">
              {rowIndex}
            </div>
          ))}
        </div>

        {/* 10x10 Grid */}
        <div className="grid grid-cols-10 gap-0.5">
          {matrix.map((row, rowIndex) =>
            row.map((probability, colIndex) => {
              const isCurrentTriggerRow = currentTrigger === rowIndex;
              const isStrongest = strongestCell.row === rowIndex && strongestCell.col === colIndex;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`
                    h-[22px] w-[22px] rounded-sm flex items-center justify-center
                    text-[9px] font-bold text-white
                    ${getHeatmapColor(probability)}
                    ${getGlowClass(probability)}
                    ${isCurrentTriggerRow ? 'ring-1 ring-[#00FF88] ring-opacity-50' : ''}
                    ${isStrongest ? 'ring-2 ring-[#00FF88] ring-opacity-70' : ''}
                    transition-all duration-200 hover:scale-110 hover:z-10 cursor-pointer
                  `}
                  title={`After ${rowIndex} → ${colIndex}: ${probability.toFixed(1)}% (${rowTotals[rowIndex]} samples)`}
                >
                  {probability > 0 ? probability.toFixed(0) : ''}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
