'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type {
  ContractMode,
  TradeType,
  DurationLimits,
  ProposalInfo,
  BuyResult,
} from '../lib/types';

interface TradeControlsProps {
  tradeType: TradeType;
  contractMode: ContractMode;
  onContractModeChange: (mode: ContractMode) => void;
  selectedDigit: number;
  isConnected: boolean;
  stake: string;
  onStakeChange: (value: string) => void;
  duration: number;
  onDurationChange: (value: number) => void;
  durationLimits: DurationLimits;
  proposal: ProposalInfo | null;
  isProposalLoading: boolean;
  onBuy: () => void;
  isBuying: boolean;
  buyResult: BuyResult | null;
  buyError: string | null;
  onClearBuyResult: () => void;
  isAuthenticated?: boolean;
}

const CONTRACT_MODE_OPTIONS: Record<TradeType, { value: ContractMode; label: string }[]> = {
  'matches-differs': [
    { value: 'DIGITMATCH', label: 'Matches' },
    { value: 'DIGITDIFF', label: 'Differs' },
  ],
  'over-under': [
    { value: 'DIGITOVER', label: 'Over' },
    { value: 'DIGITUNDER', label: 'Under' },
  ],
  'even-odd': [
    { value: 'DIGITEVEN', label: 'Even' },
    { value: 'DIGITODD', label: 'Odd' },
  ],
};

function getPredictionText(contractMode: ContractMode): string {
  switch (contractMode) {
    case 'DIGITMATCH':
      return 'match';
    case 'DIGITDIFF':
      return 'differ from';
    case 'DIGITOVER':
      return 'be over';
    case 'DIGITUNDER':
      return 'be under';
    case 'DIGITEVEN':
      return 'be even';
    case 'DIGITODD':
      return 'be odd';
  }
}

function showDigitInPrediction(contractMode: ContractMode): boolean {
  return contractMode !== 'DIGITEVEN' && contractMode !== 'DIGITODD';
}

export function TradeControls({
  tradeType,
  contractMode,
  onContractModeChange,
  selectedDigit,
  isConnected,
  stake,
  onStakeChange,
  duration,
  onDurationChange,
  durationLimits,
  proposal,
  isProposalLoading,
  onBuy,
  isBuying,
  buyResult,
  buyError,
  onClearBuyResult,
  isAuthenticated,
}: TradeControlsProps) {
  useEffect(() => {
    if (buyError) {
      toast.error('Purchase Failed', { description: buyError });
      onClearBuyResult();
    }
  }, [buyError, onClearBuyResult]);

  useEffect(() => {
    if (buyResult) {
      toast.success('Contract Purchased', {
        description: `Buy price: ${buyResult.buyPrice.toFixed(2)} USD | Payout: ${buyResult.payout.toFixed(2)} USD | Balance: ${buyResult.balanceAfter.toFixed(2)} USD`,
      });
      onClearBuyResult();
    }
  }, [buyResult, onClearBuyResult]);

  const modeOptions = CONTRACT_MODE_OPTIONS[tradeType];

  return (
    <div className="space-y-3 sm:space-y-4">
      <ToggleGroup
        type="single"
        value={contractMode}
        onValueChange={value => {
          if (value) onContractModeChange(value as ContractMode);
        }}
        className="w-full gap-2 rounded-xl bg-white/5 p-1.5 border border-white/10"
      >
        {modeOptions.map(opt => (
          <ToggleGroupItem
            key={opt.value}
            value={opt.value}
            className="flex-1 rounded-lg text-sm font-semibold text-muted-foreground data-[state=on]:bg-gradient-to-r data-[state=on]:from-neon-cyan data-[state=on]:to-neon-green data-[state=on]:text-black data-[state=on]:font-bold data-[state=on]:glow-cyan hover:text-foreground astral-transition"
          >
            {opt.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="stake" className="text-xs text-muted-foreground uppercase tracking-wider">
            Stake
          </Label>
          <Input
            id="stake"
            type="number"
            value={stake}
            onChange={e => onStakeChange(e.target.value)}
            onKeyDown={e => {
              if (['e', 'E', '+', '-'].includes(e.key)) e.preventDefault();
            }}
            min={0}
            step="0.01"
            labelRight="USD"
            className="astral-glass border-white/20 input-glow"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="duration" className="text-xs text-muted-foreground uppercase tracking-wider">
            Duration
          </Label>
          <Input
            id="duration"
            type="number"
            value={duration}
            onChange={e => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) onDurationChange(val);
            }}
            min={durationLimits.min}
            max={durationLimits.max}
            step={1}
            labelRight="Ticks"
            className="astral-glass border-white/20 input-glow"
          />
        </div>
      </div>

      <div className="rounded-xl border border-neon-cyan/30 p-3 sm:p-4 bg-neon-cyan/10 space-y-2">
        <p className="text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider">Prediction</p>
        <p className="text-xs sm:text-sm font-medium">
          Last digit of the price will{' '}
          <span className="text-neon-cyan font-bold">{getPredictionText(contractMode)}</span>
          {showDigitInPrediction(contractMode) && (
            <>
              {' '}
              <span className="inline-flex w-6 h-6 rounded-full bg-gradient-to-br from-neon-cyan to-neon-green text-black items-center justify-center text-xs font-bold glow-cyan">
                {selectedDigit}
              </span>
            </>
          )}
        </p>
        {(proposal || isProposalLoading) && (
          <div className="flex items-center justify-between pt-2 border-t border-neon-cyan/30">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Payout</span>
            {isProposalLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <span className="text-sm font-bold text-neon-green">
                {proposal!.payout.toFixed(2)} USD
              </span>
            )}
          </div>
        )}
      </div>

      {/* Buy button — fixed above footer on mobile, inline on desktop */}
      <div className="max-lg:fixed max-lg:bottom-[calc(env(safe-area-inset-bottom)+2.5rem)] max-lg:left-3 max-lg:right-3 lg:static">
        <Button
          className="w-full h-11 rounded-xl px-6 sm:h-12 sm:px-8 bg-gradient-to-r from-neon-green to-neon-cyan hover:from-neon-green/80 hover:to-neon-cyan/80 border-0 text-black font-bold btn-premium"
          disabled={!isConnected || !proposal || isBuying}
          onClick={onBuy}
        >
          {isBuying
            ? 'Purchasing...'
            : proposal
              ? `Buy @ ${proposal.askPrice.toFixed(2)} USD`
              : 'Buy Contract'}
        </Button>
      </div>

      {isAuthenticated && (
        <Button asChild variant="ghost" className="w-full text-sm text-muted-foreground hover:text-neon-cyan hover:bg-neon-cyan/10">
          <Link href="/reports">View your positions →</Link>
        </Button>
      )}
    </div>
  );
}
