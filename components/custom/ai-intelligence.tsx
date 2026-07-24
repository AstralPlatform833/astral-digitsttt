'use client';

import { Card } from '@/components/ui/card';

interface AIIntelligenceProps {
  isConnected?: boolean;
}

export function AIIntelligence({ isConnected = false }: AIIntelligenceProps) {
  return (
    <Card className="astral-glass border-glow-pink p-5">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-pink to-neon-purple flex items-center justify-center text-white font-bold text-sm glow-pink">
          🧠
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground">
          AI Astral Intelligence
        </h3>
      </div>
      
      {/* Signal Area */}
      <div className="bg-neon-pink/10 border border-neon-pink/30 rounded-xl p-4 mb-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Market Status</p>
        <p className="text-xl font-bold text-neon-pink">
          {isConnected ? 'ACTIVE' : 'STANDBY'}
        </p>
      </div>

      {/* Confidence Display */}
      <div className="bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl p-4 mb-3">
        <div className="flex justify-between items-center mb-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">System Status</p>
          <p className="text-2xl font-bold text-neon-cyan">
            {isConnected ? 'ONLINE' : 'OFFLINE'}
          </p>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r from-neon-cyan to-neon-green rounded-full transition-all duration-500 ${isConnected ? 'w-full' : 'w-0'}`}
          />
        </div>
      </div>

      {/* Market Analysis */}
      <div className="bg-neon-green/10 border border-neon-green/30 rounded-xl p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Analysis</p>
        <p className="text-xs text-foreground/80 leading-relaxed">
          {isConnected 
            ? 'Market data streaming normally. Digit patterns being analyzed in real-time.'
            : 'Waiting for connection to initialize market analysis.'}
        </p>
      </div>
    </Card>
  );
}
