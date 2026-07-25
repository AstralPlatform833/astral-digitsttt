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
  const [isBlinking, setIsBlinking] = useState(false);

  // Auto-dismiss speech bubble after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, [signal]);

  // Blink animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

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

  const getMouthExpression = () => {
    switch (animationState) {
      case 'signal':
        return 'w-6 h-3 rounded-b-full bg-[#2D2D2D]';
      case 'thinking':
        return 'w-4 h-1 rounded-full bg-[#2D2D2D]';
      case 'weak':
        return 'w-3 h-1 rounded-full border-b-2 border-[#2D2D2D]';
      default:
        return 'w-4 h-2 rounded-full border-b-2 border-[#2D2D2D]';
    }
  };

  const getEyeExpression = () => {
    if (isBlinking) return 'scale-y-10';
    switch (animationState) {
      case 'thinking':
        return 'translate-y-1';
      case 'signal':
        return 'scale-110';
      case 'weak':
        return 'scale-95';
      default:
        return '';
    }
  };

  return (
    <div className="fixed bottom-12 right-12 z-50 pointer-events-none">
      {/* Speech Bubble */}
      {showBubble && (
        <div className="absolute bottom-full right-0 mb-4 w-56 bg-[#10141D]/95 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-2xl animate-fade-in">
          <div className="absolute bottom-0 right-6 transform translate-y-1/2 rotate-45 w-3 h-3 bg-[#10141D]/95 border-r border-b border-white/10"></div>
          <p className="text-[11px] text-white/90 leading-relaxed">
            {getMessage()}
          </p>
        </div>
      )}

      {/* Astra Character */}
      <div className="relative w-20 h-24">
        {/* Shadow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/30 blur-md rounded-full"></div>
        
        {/* Body */}
        <div className={`relative w-full h-full flex flex-col items-center ${getAnimationClass()}`}>
          {/* Head */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#C4A484] via-[#A89070] to-[#8B7355] shadow-2xl relative overflow-hidden">
            {/* Fur texture layers */}
            <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-transparent via-[#D4B896]/30 to-transparent"></div>
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_50%)]"></div>
            
            {/* Ears */}
            <div className="absolute -top-2 left-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#C4A484] to-[#8B7355] shadow-lg">
              <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-[#E8D4B8]"></div>
            </div>
            <div className="absolute -top-2 right-0 w-6 h-6 rounded-full bg-gradient-to-br from-[#C4A484] to-[#8B7355] shadow-lg">
              <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#E8D4B8]"></div>
            </div>
            
            {/* Face */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-10">
              {/* Eyes */}
              <div className="flex justify-between px-1.5">
                <div className={`relative transition-transform duration-200 ${getEyeExpression()}`}>
                  <div className="w-3.5 h-4 rounded-full bg-gradient-to-b from-white to-gray-100 shadow-inner">
                    <div className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full bg-[#1a1a1a]"></div>
                    <div className="absolute top-1 left-1 w-0.5 h-0.5 rounded-full bg-white"></div>
                  </div>
                </div>
                <div className={`relative transition-transform duration-200 ${getEyeExpression()}`}>
                  <div className="w-3.5 h-4 rounded-full bg-gradient-to-b from-white to-gray-100 shadow-inner">
                    <div className="absolute top-0.5 left-0.5 w-2 h-2 rounded-full bg-[#1a1a1a]"></div>
                    <div className="absolute top-1 left-1 w-0.5 h-0.5 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
              {/* Nose */}
              <div className="w-2.5 h-2 rounded-full bg-gradient-to-b from-[#3D3D3D] to-[#2D2D2D] mx-auto mt-1 shadow-sm"></div>
              {/* Mouth */}
              <div className={`mx-auto mt-1.5 transition-all duration-300 ${getMouthExpression()}`}></div>
              {/* Cheeks */}
              <div className="absolute bottom-0 left-0 w-2.5 h-1.5 rounded-full bg-[#FFB6C1]/30 blur-[2px]"></div>
              <div className="absolute bottom-0 right-0 w-2.5 h-1.5 rounded-full bg-[#FFB6C1]/30 blur-[2px]"></div>
            </div>
          </div>
          
          {/* Hoodie Body */}
          <div className="w-14 h-10 bg-gradient-to-br from-[#5A5A6A] to-[#4A4A5A] rounded-b-3xl -mt-2 shadow-xl relative overflow-hidden">
            {/* Hoodie texture */}
            <div className="absolute inset-0 opacity-15 bg-gradient-to-br from-transparent via-white/10 to-transparent"></div>
            {/* Hood strings */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-3">
              <div className="w-0.5 h-4 bg-[#3A3A4A] rounded-full"></div>
              <div className="w-0.5 h-4 bg-[#3A3A4A] rounded-full"></div>
            </div>
            {/* Hoodie pocket */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-[#4A4A5A] rounded-t-lg border-t border-white/5"></div>
          </div>
          
          {/* Tiny hands peeking out */}
          <div className="absolute bottom-3 -left-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#C4A484] to-[#8B7355] shadow-md"></div>
          <div className="absolute bottom-3 -right-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-[#C4A484] to-[#8B7355] shadow-md"></div>
          
          {/* Tiny feet */}
          <div className="absolute -bottom-1 left-2 w-3 h-2 rounded-full bg-gradient-to-br from-[#4A4A5A] to-[#3A3A4A] shadow-sm"></div>
          <div className="absolute -bottom-1 right-2 w-3 h-2 rounded-full bg-gradient-to-br from-[#4A4A5A] to-[#3A3A4A] shadow-sm"></div>
          
          {/* Status Indicator */}
          {isConnected && (
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#00FF88] rounded-full border-2 border-[#8B7355] shadow-lg shadow-[#00FF88]/50 animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );
}
