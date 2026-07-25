'use client';

import { useState, useEffect } from 'react';
import type { StrategyResult } from '@/lib/strategies';

interface AstraOverlayProps {
  signal: StrategyResult;
  hasData: boolean;
  isConnected?: boolean;
}

export function AstraOverlay({ signal, hasData, isConnected = false }: AstraOverlayProps) {
  const [showBubble, setShowBubble] = useState(true);
  const [animationState, setAnimationState] = useState<'idle' | 'thinking' | 'signal' | 'waiting' | 'weak'>('idle');

  // Auto-dismiss speech bubble after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [signal]);

  // Update animation state based on signal
  useEffect(() => {
    if (!hasData) {
      setAnimationState('thinking');
    } else if (!signal.isValid) {
      setAnimationState('waiting');
    } else if (signal.confidence >= 80) {
      setAnimationState('signal');
    } else if (signal.confidence >= 60) {
      setAnimationState('idle');
    } else {
      setAnimationState('weak');
    }
  }, [signal, hasData]);

  const getMessage = () => {
    if (!hasData) {
      return "Collecting enough evidence...";
    }
    if (!signal.isValid) {
      return "Watching the market...";
    }
    switch (signal.type) {
      case 'OVER_1':
        return `OVER 1 qualified after digit ${signal.triggerDigit}.`;
      case 'UNDER_8':
        return `UNDER 8 has the strongest edge.`;
      case 'DIFFERS':
        return `Rare transition detected.`;
      default:
        return "Watching the market...";
    }
  };

  const getAnimationClass = () => {
    switch (animationState) {
      case 'idle':
        return 'animate-breathe';
      case 'thinking':
        return 'animate-thinking';
      case 'signal':
        return 'animate-signal';
      case 'waiting':
        return 'animate-waiting';
      case 'weak':
        return 'animate-weak';
      default:
        return 'animate-breathe';
    }
  };

  return (
    <div className="fixed bottom-12 right-12 z-50 pointer-events-none">
      {/* Speech Bubble */}
      {showBubble && (
        <div className="absolute bottom-full right-0 mb-4 w-64 bg-[#10141D]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl animate-fade-in">
          <div className="absolute bottom-0 right-8 transform translate-y-1/2 rotate-45 w-4 h-4 bg-[#10141D]/95 border-r border-b border-white/10"></div>
          <p className="text-xs text-white/90 leading-relaxed">
            {getMessage()}
          </p>
        </div>
      )}

      {/* Astra Character */}
      <div className="relative w-24 h-28">
        {/* Shadow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-5 bg-black/40 blur-md rounded-full"></div>
        
        {/* Body */}
        <div className={`relative w-full h-full flex flex-col items-center ${getAnimationClass()}`}>
          {/* Head */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8B7355] to-[#6B5344] shadow-2xl relative overflow-hidden">
            {/* Fur texture */}
            <div className="absolute inset-0 opacity-30 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
            
            {/* Ears */}
            <div className="absolute -top-3 left-1 w-7 h-7 rounded-full bg-gradient-to-br from-[#8B7355] to-[#6B5344] shadow-lg"></div>
            <div className="absolute -top-3 right-1 w-7 h-7 rounded-full bg-gradient-to-br from-[#8B7355] to-[#6B5344] shadow-lg"></div>
            {/* Inner ears */}
            <div className="absolute -top-1 left-2 w-4 h-4 rounded-full bg-[#D4A574]"></div>
            <div className="absolute -top-1 right-2 w-4 h-4 rounded-full bg-[#D4A574]"></div>
            
            {/* Face */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-12">
              {/* Eyes */}
              <div className="flex justify-between px-2">
                <div className="relative">
                  <div className="w-4 h-5 rounded-full bg-gradient-to-b from-white to-gray-200 shadow-inner">
                    <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#2D2D2D]"></div>
                    <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-white"></div>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-4 h-5 rounded-full bg-gradient-to-b from-white to-gray-200 shadow-inner">
                    <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-[#2D2D2D]"></div>
                    <div className="absolute top-1.5 left-1.5 w-1 h-1 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
              {/* Nose */}
              <div className="w-3 h-2.5 rounded-full bg-[#2D2D2D] mx-auto mt-1 shadow-md"></div>
              {/* Mouth */}
              <div className={`w-5 h-2 mx-auto mt-2 rounded-full border-b-2 border-[#2D2D2D] ${
                animationState === 'signal' ? 'w-6 h-3 rounded-b-full bg-[#2D2D2D]' : ''
              }`}></div>
              {/* Cheeks */}
              <div className="absolute bottom-0 left-0 w-3 h-2 rounded-full bg-[#FFB6C1]/40 blur-sm"></div>
              <div className="absolute bottom-0 right-0 w-3 h-2 rounded-full bg-[#FFB6C1]/40 blur-sm"></div>
            </div>
          </div>
          
          {/* Hoodie Body */}
          <div className="w-18 h-12 bg-gradient-to-br from-[#4A4A5A] to-[#3A3A4A] rounded-b-3xl -mt-3 shadow-xl relative overflow-hidden">
            {/* Hoodie texture */}
            <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent via-white/5 to-transparent"></div>
            {/* Hoodie pocket */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-4 bg-[#3A3A4A] rounded-t-lg border-t border-white/10"></div>
          </div>
          
          {/* Tiny hands peeking out */}
          <div className="absolute bottom-4 -left-2 w-5 h-5 rounded-full bg-gradient-to-br from-[#8B7355] to-[#6B5344] shadow-md"></div>
          <div className="absolute bottom-4 -right-2 w-5 h-5 rounded-full bg-gradient-to-br from-[#8B7355] to-[#6B5344] shadow-md"></div>
          
          {/* Status Indicator */}
          {isConnected && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#00FF88] rounded-full border-2 border-[#6B5344] shadow-lg shadow-[#00FF88]/50 animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
}
