'use client';

import { useMemo } from 'react';
import { Ban } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Footer } from '@/components/custom/footer';
import { Header } from '@/components/custom/header';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { CurrentTickDisplay } from './current-tick-display';
import { DigitStatsBar } from './digit-stats-bar';
import { TradeControls } from './trade-controls';
import { ConfigurableDigitsControls } from './configurable-digits-controls';
import { TradeTypeChips } from '@/components/custom/trade-type-chips';
import { SymbolSelector } from '@/components/custom/symbol-selector';
import { ThemeToggle } from '@/components/custom/theme-toggle';
import { AISignal } from '@/components/custom/ai-intelligence';
import { LiveDigitStream } from '@/components/custom/live-digit-stream';
import { TransitionMatrix } from '@/components/custom/transition-matrix';
import { TradeStatus } from '@/components/custom/trade-status';
import type {
  AuthState,
  DerivAccount,
  ActiveSymbol,
  Tick,
  ProposalInfo,
  DurationLimits,
  BuyResult,
} from '@deriv/core';
import type { ContractMode, TradeType, DigitStats } from '../lib/types';
import type { OpenPosition } from '@/hooks/use-open-positions';
import type { ClosedPosition } from '@/hooks/use-closed-positions';
import type { DigitsAppConfig } from '../lib/app-config';
import { PositionsTable } from './custom/positions-table';

const DIGIT_TRADE_TYPE_OPTIONS: { value: TradeType; label: string }[] = [
  { value: 'matches-differs', label: 'Matches/Differs' },
  { value: 'over-under', label: 'Over/Under' },
  { value: 'even-odd', label: 'Even/Odd' },
];

export interface DigitsViewProps {
  // Auth
  authState: AuthState;
  accounts: DerivAccount[];
  activeAccount: DerivAccount | null;
  onLogin: () => Promise<void>;
  onSignUp: () => Promise<void>;
  onLogout: () => void;
  onSwitchAccount: (accountId: string) => Promise<void>;

  // Connection / loading
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;

  // Market data
  symbols: ActiveSymbol[];
  activeSymbol: ActiveSymbol | null;
  selectSymbol: (symbol: string) => void;
  currentTick: Tick | null;
  lastDigit: number | null;
  digitStats: DigitStats;
  pipSize: number;
  prices: number[];

  // Trade controls
  tradeType: TradeType;
  setTradeType: (type: TradeType) => void;
  contractMode: ContractMode;
  setContractMode: (mode: ContractMode) => void;
  selectedDigit: number;
  setSelectedDigit: (digit: number) => void;
  stake: string;
  setStake: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  durationLimits: DurationLimits;
  proposal: ProposalInfo | null;
  isProposalLoading: boolean;
  buyContract: () => Promise<void>;
  isBuying: boolean;
  buyResult: BuyResult | null;
  buyError: string | null;
  clearBuyResult: () => void;
  openPositions: OpenPosition[];
  closedPositions: ClosedPosition[];
  sellContract: (contractId: number, bidPrice: string) => Promise<void>;
  sellingId: number | null;
  sellError: string | null;
  clearSellError: () => void;
  // Branding (used by preview route; no-op in the real app)
  logoSrc?: string;
  appName?: string;

  /**
   * No-code config. When provided, the controls render in configurable
   * styles/order (ConfigurableDigitsControls). When omitted, the standard
   * DigitsView layout renders unchanged.
   */
  appConfig?: DigitsAppConfig;
  /** Edit mode — components become selectable (click opens their accordion). */
  editMode?: boolean;
  /** Called when an editable component is clicked (e.g. "stake"). */
  onSelect?: (key: string) => void;
  /** Currently selected component (highlighted). */
  selectedKey?: string | null;
  /** Rearrange mode — drag blocks in the phone to reorder the layout. */
  rearrangeMode?: boolean;
  /** Called with the new block order after a drag-drop reorder. */
  onReorder?: (order: DigitsAppConfig['order']) => void;
}

export function DigitsView({
  authState,
  accounts,
  activeAccount,
  onLogin,
  onSignUp,
  onLogout,
  onSwitchAccount,
  isConnected,
  isLoading,
  error,
  symbols,
  activeSymbol,
  selectSymbol,
  currentTick,
  lastDigit,
  digitStats,
  pipSize,
  prices,
  tradeType,
  setTradeType,
  contractMode,
  setContractMode,
  selectedDigit,
  setSelectedDigit,
  stake,
  setStake,
  duration,
  setDuration,
  durationLimits,
  proposal,
  isProposalLoading,
  buyContract,
  isBuying,
  buyResult,
  buyError,
  clearBuyResult,
  openPositions,
  closedPositions,
  sellContract,
  sellingId,
  sellError,
  clearSellError,
  logoSrc,
  appName,
  appConfig,
  editMode,
  onSelect,
  selectedKey,
  rearrangeMode,
  onReorder,
}: DigitsViewProps) {
  const isMobile = useIsMobile();

  // In edit mode, login/sign-up/account actions are inert (no OAuth navigation
  // out of the editor) — only the theme toggle stays interactive.
  const headerEl = useMemo(() => {
    const noop = () => {};
    const noopAsync = async () => {};
    return (
      <Header
        authState={authState}
        accounts={accounts}
        activeAccount={activeAccount}
        onLogin={editMode ? noopAsync : onLogin}
        onSignUp={editMode ? noopAsync : onSignUp}
        onLogout={editMode ? noop : onLogout}
        onSwitchAccount={editMode ? noopAsync : onSwitchAccount}
        logoSrc={logoSrc}
        appName={appName}
        actions={<ThemeToggle />}
      />
    );
  }, [
    authState,
    accounts,
    activeAccount,
    editMode,
    onLogin,
    onSignUp,
    onLogout,
    onSwitchAccount,
    logoSrc,
    appName,
  ]);

  if (error) {
    return (
      <main className="flex flex-col bg-background items-center justify-center px-4 min-h-dvh">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">Connection Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  // The configurable controls — a single, reorderable column of every block.
  const renderConfigurable = () =>
    appConfig ? (
      <ConfigurableDigitsControls
        config={appConfig}
        symbols={symbols}
        activeSymbol={activeSymbol}
        selectSymbol={selectSymbol}
        currentTick={currentTick}
        lastDigit={lastDigit}
        digitStats={digitStats}
        pipSize={pipSize}
        tradeType={tradeType}
        onTradeTypeChange={setTradeType}
        contractMode={contractMode}
        onContractModeChange={setContractMode}
        selectedDigit={selectedDigit}
        onDigitSelect={setSelectedDigit}
        stake={stake}
        onStakeChange={setStake}
        duration={duration}
        onDurationChange={setDuration}
        durationLimits={durationLimits}
        proposal={proposal}
        isProposalLoading={isProposalLoading}
        onBuy={buyContract}
        isBuying={isBuying}
        buyResult={buyResult}
        buyError={buyError}
        onClearBuyResult={clearBuyResult}
        isConnected={isConnected}
        isAuthenticated={authState === 'authenticated'}
        editMode={editMode}
        onSelect={onSelect}
        selectedKey={selectedKey}
        rearrangeMode={rearrangeMode}
        onReorder={onReorder}
      />
    ) : null;

  return (
    <main
      className={`flex flex-col max-lg:h-dvh max-lg:overflow-y-auto lg:overflow-visible ${
        editMode ? 'bg-muted/50' : 'bg-background'
      }`}
    >
      {editMode ? (
        // Edit mode: header is fixed and NOT editable. On hover, grey it out with
        // a "Not editable" hint. The overlay is pointer-events-none so the header
        // (incl. the dark/light theme toggle) stays clickable.
        <div className="group/hdr fixed left-0 right-0 top-0 z-50" style={{ height: 66 }}>
          {headerEl}
          <div className="pointer-events-none absolute inset-0 z-[60] opacity-0 ring-2 ring-inset ring-muted-foreground/25 transition-opacity group-hover/hdr:opacity-100">
            <span className="absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-md bg-background/90 px-2 py-1 text-[11px] font-medium text-muted-foreground shadow-sm ring-1 ring-border">
              <Ban className="h-3.5 w-3.5" />
              Not editable
            </span>
          </div>
        </div>
      ) : (
        headerEl
      )}
      {/* Spacer to push content below fixed header — taller when authenticated (account bar visible) */}
      <div className={authState === 'authenticated' ? 'h-[76px] shrink-0' : 'h-[66px] shrink-0'} />

      {appConfig ? (
        isMobile ? (
          /* No-code mobile layout: a single, reorderable column of blocks. */
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
            <div className="mx-auto flex w-full max-w-md flex-col gap-3 px-3 py-3 pb-28">
              {isLoading ? <Skeleton className="h-[420px] w-full rounded-xl" /> : renderConfigurable()}
            </div>
          </div>
        ) : (
          /* No-code desktop layout: a single centred controls card so the
             ordering stays honest (drag-to-reorder is top-to-bottom). */
          <div className="flex w-full max-w-2xl mx-auto flex-col px-4 py-4 pb-24">
            {isLoading ? (
              <Skeleton className="h-[420px] w-full rounded-xl" />
            ) : (
              <Card className="overflow-y-auto">
                <CardContent className="pt-4">{renderConfigurable()}</CardContent>
              </Card>
            )}
          </div>
        )
      ) : (
        /* Premium Astral layout: responsive grid with new components */
        <div className="flex w-full max-w-[1440px] mx-auto flex-col px-4 py-4 gap-4 lg:flex-none lg:overflow-visible pb-10">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-64 rounded-xl" />
            </div>
          ) : (
            <>
              {/* Trade type chips */}
              <div className="shrink-0 overflow-x-auto pb-0.5 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <TradeTypeChips
                  value={tradeType}
                  options={DIGIT_TRADE_TYPE_OPTIONS}
                  onValueChange={setTradeType}
                />
              </div>

              {/* Premium Grid Layout - Compact Terminal */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Row 1: Market Selector + Live Digit Stream */}
                <Card className="astral-glass border-glow-cyan p-4 md:col-span-4 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-neon-cyan to-neon-green flex items-center justify-center text-white font-bold text-xs glow-cyan">
                      💹
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Market
                    </h3>
                  </div>
                  <SymbolSelector
                    symbols={symbols}
                    activeSymbol={activeSymbol}
                    onSymbolChange={selectSymbol}
                  />
                </Card>

                <LiveDigitStream
                  currentTick={currentTick}
                  lastDigit={lastDigit}
                  activeSymbol={activeSymbol}
                  pipSize={pipSize}
                  prices={prices}
                />

                {/* Row 2: Digit Distribution + Astral Signal */}
                <Card className="astral-glass border-glow-green p-4 md:col-span-8 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center text-white font-bold text-xs glow-green">
                      📈
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                      Digit Distribution
                    </h3>
                  </div>
                  <DigitStatsBar
                    digitStats={digitStats}
                    selectedDigit={selectedDigit}
                    onDigitSelect={setSelectedDigit}
                    lastDigit={lastDigit}
                  />
                </Card>

                <AISignal selectedDigit={selectedDigit} isConnected={isConnected} />

                {/* Row 3: Trading Controls - Full Width */}
                {authState === 'authenticated' && (
                  <Card className="astral-glass border-glow-green p-4 md:col-span-12 rounded-xl">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-6 h-6 rounded bg-gradient-to-br from-neon-green to-neon-cyan flex items-center justify-center text-white font-bold text-xs glow-green">
                        ⚡
                      </div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
                        Trading Controls
                      </h3>
                    </div>
                    <TradeControls
                      tradeType={tradeType}
                      contractMode={contractMode}
                      onContractModeChange={setContractMode}
                      selectedDigit={selectedDigit}
                      isConnected={isConnected}
                      stake={stake}
                      onStakeChange={setStake}
                      duration={duration}
                      onDurationChange={setDuration}
                      durationLimits={durationLimits}
                      proposal={proposal}
                      isProposalLoading={isProposalLoading}
                      onBuy={buyContract}
                      isBuying={isBuying}
                      buyResult={buyResult}
                      buyError={buyError}
                      onClearBuyResult={clearBuyResult}
                      isAuthenticated={authState === 'authenticated'}
                    />
                  </Card>
                )}

                {/* Row 4: Transition Matrix - Full Width */}
                <TransitionMatrix digitStats={digitStats} />
              </div>
            </>
          )}
        </div>
      )}

      {/* Fixed footer */}
      <div className="fixed bottom-0 left-0 right-0 py-2 text-center bg-background/80 backdrop-blur-sm">
        <Footer />
      </div>
    </main>
  );
}
