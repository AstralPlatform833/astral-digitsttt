'use client';

import { Card } from '@/components/ui/card';
import type { DigitStats } from '@/lib/types';

interface TransitionMatrixProps {
  digitStats: DigitStats;
}

export function TransitionMatrix({ digitStats }: TransitionMatrixProps) {
  // Generate a 10x10 matrix with heatmap-style colors based on percentages
  const generateMatrix = () => {
    const matrix = [];
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        // Use digit stats percentages to determine intensity
        const intensity = (digitStats.percentages[i] + digitStats.percentages[j]) / 2;
        matrix.push({ digit: j, intensity, row: i, col: j });
      }
    }
    return matrix;
  };

  const matrix = generateMatrix();

  const getHeatmapColor = (intensity: number) => {
    if (intensity > 15) return 'bg-neon-pink/80';
    if (intensity > 12) return 'bg-neon-cyan/80';
    if (intensity > 10) return 'bg-neon-green/80';
    if (intensity > 8) return 'bg-neon-purple/60';
    if (intensity > 6) return 'bg-neon-pink/40';
    return 'bg-white/10';
  };

  const getGlowClass = (intensity: number) => {
    if (intensity > 15) return 'glow-pink';
    if (intensity > 12) return 'glow-cyan';
    if (intensity > 10) return 'glow-green';
    return '';
  };

  return (
    <Card className="astral-glass border-glow-purple p-4 md:col-span-12 rounded-xl">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-5 h-5 rounded bg-gradient-to-br from-neon-purple to-neon-pink flex items-center justify-center text-white font-bold text-xs glow-purple">
          🔄
        </div>
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-foreground">
          Transition Matrix
        </h3>
      </div>

      <div className="grid grid-cols-10 gap-1">
        {matrix.map((cell, index) => (
          <div
            key={`${cell.row}-${cell.col}`}
            className={`
              aspect-square rounded-sm flex items-center justify-center
              text-xs font-bold text-white
              ${getHeatmapColor(cell.intensity)}
              ${getGlowClass(cell.intensity)}
              transition-all duration-300 hover:scale-110 hover:z-10 cursor-pointer
            `}
            title={`Row: ${cell.row}, Col: ${cell.col}, Intensity: ${cell.intensity.toFixed(1)}%`}
          >
            {cell.digit}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Digit transition patterns</span>
        <span className="text-neon-purple">Heatmap</span>
      </div>
    </Card>
  );
}
