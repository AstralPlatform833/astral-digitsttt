'use client';

import { cn } from '@/lib/utils';
import type { StrategyResult } from '@/lib/strategies';

interface AstraPanelProps {
  signal: StrategyResult;
  hasData: boolean;
  isConnected?: boolean;
}

/** Astra's contextual message — mirrors the overlay logic, presentation only. */
function getMessage(signal: StrategyResult, hasData: boolean): string {
  if (!hasData) return 'Collecting enough evidence before I call a setup…';
  if (!signal.isValid) return 'Watching the market — no qualified edge just yet.';
  switch (signal.type) {
    case 'OVER_1':
      return `OVER 1 looks qualified after digit ${signal.triggerDigit}. Solid setup.`;
    case 'UNDER_8':
      return 'UNDER 8 currently has the strongest edge on the board.';
    case 'DIFFERS':
      return `Rare transition detected — ${signal.signal}. Strong setup.`;
    default:
      return signal.signal || 'Watching the market…';
  }
}

/**
 * Astra — the AI companion, docked into the dashboard flow instead of floating
 * over content. Reads the same signal props the overlay used; no logic changes.
 */
export function AstraPanel({ signal, hasData, isConnected = false }: AstraPanelProps) {
  const message = getMessage(signal, hasData);
  const confidence = hasData ? Math.min(signal.confidence, 100) : 0;

  return (
    <section className="astral-panel relative overflow-hidden rounded-xl p-4">
      {/* Soft accent wash behind the mascot */}
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-neon-purple/10 blur-3xl"
        aria-hidden
      />

      <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        {/* Mascot */}
        <div className="relative shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- static public asset; next/image optimizer is intentionally avoided project-wide */}
          <img
            src="/astra-bear.png"
            alt="Astra, your AI trading companion"
            className="h-24 w-24 object-contain drop-shadow-[0_8px_24px_rgba(168,85,247,0.35)] sm:h-28 sm:w-28"
          />
          <span
            className={cn(
              'absolute right-2 top-2 h-3 w-3 rounded-full border-2 border-background',
              isConnected ? 'bg-neon-green animate-pulse glow-green' : 'bg-muted-foreground'
            )}
            aria-hidden
          />
        </div>

        {/* Insight */}
        <div className="min-w-0 flex-1 space-y-2 text-center sm:text-left">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-neon-purple to-neon-pink text-[11px] font-bold text-white glow-purple">
              A
            </span>
            <span className="text-sm font-bold text-foreground">Astra</span>
            <span className="rounded-full bg-neon-purple/15 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-neon-purple">
              AI
            </span>
          </div>

          <p className="text-sm leading-relaxed text-balance text-foreground/90">{message}</p>

          {hasData && signal.isValid && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                <span>Confidence</span>
                <span className="font-semibold tabular-nums text-neon-green">
                  {confidence.toFixed(0)}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-neon-purple to-neon-green transition-all duration-500"
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
