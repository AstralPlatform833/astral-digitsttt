import type { DigitStats } from './types';
import type { TransitionMatrix } from './transition-matrix';
import { computeTransitionMatrix, findBestTrigger, findRarestNext } from './transition-matrix';

/**
 * Strategy result interface
 */
export interface StrategyResult {
  type: 'OVER_1' | 'UNDER_8' | 'DIFFERS' | 'WAIT';
  signal: string;
  triggerDigit?: number;
  targetDigit?: number;
  confidence: number;
  evidence: string;
  isValid: boolean;
}

/**
 * OVER 1 Strategy
 * Conditions:
 * - Digits 0 and 1 must both be below 10.5%
 * - Neither 0 nor 1 may be most/least appearing
 * - Find trigger where P(next > 1 | current = trigger) is highest
 */
export function over1Strategy(
  digitStats: DigitStats,
  prices: number[],
  pipSize: number
): StrategyResult {
  const { percentages, counts, totalTicks } = digitStats;

  // Condition A: Both 0 and 1 below 10.5%
  if (percentages[0] >= 10.5 || percentages[1] >= 10.5) {
    return {
      type: 'WAIT',
      signal: 'WAIT',
      confidence: 0,
      evidence: `Digits 0 (${percentages[0].toFixed(1)}%) or 1 (${percentages[1].toFixed(1)}%) not below 10.5% threshold`,
      isValid: false,
    };
  }

  // Condition B: Neither 0 nor 1 is most/least appearing
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);
  if (counts[0] === maxCount || counts[0] === minCount || counts[1] === maxCount || counts[1] === minCount) {
    return {
      type: 'WAIT',
      signal: 'WAIT',
      confidence: 0,
      evidence: 'Digits 0 or 1 are extreme (most/least appearing)',
      isValid: false,
    };
  }

  // Condition C: Find best trigger for digits > 1
  const matrix = computeTransitionMatrix(prices, pipSize);
  const targetDigits = [2, 3, 4, 5, 6, 7, 8, 9];
  const bestTrigger = findBestTrigger(matrix, targetDigits, [0, 1]);

  if (!bestTrigger || bestTrigger.probability < 50) {
    return {
      type: 'WAIT',
      signal: 'WAIT',
      confidence: 0,
      evidence: 'No qualified trigger with sufficient evidence',
      isValid: false,
    };
  }

  return {
    type: 'OVER_1',
    signal: `BUY OVER 1 AFTER ${bestTrigger.trigger}`,
    triggerDigit: bestTrigger.trigger,
    confidence: bestTrigger.probability,
    evidence: `P(next > 1 | ${bestTrigger.trigger}) = ${bestTrigger.probability.toFixed(1)}%`,
    isValid: true,
  };
}

/**
 * UNDER 8 Strategy
 * Conditions:
 * - Digits 8 and 9 must both be below 10.5%
 * - Neither 8 nor 9 may be most/least appearing
 * - Find trigger where P(next < 8 | current = trigger) is highest
 */
export function under8Strategy(
  digitStats: DigitStats,
  prices: number[],
  pipSize: number
): StrategyResult {
  const { percentages, counts } = digitStats;

  // Condition A: Both 8 and 9 below 10.5%
  if (percentages[8] >= 10.5 || percentages[9] >= 10.5) {
    return {
      type: 'WAIT',
      signal: 'WAIT',
      confidence: 0,
      evidence: `Digits 8 (${percentages[8].toFixed(1)}%) or 9 (${percentages[9].toFixed(1)}%) not below 10.5% threshold`,
      isValid: false,
    };
  }

  // Condition B: Neither 8 nor 9 is most/least appearing
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);
  if (counts[8] === maxCount || counts[8] === minCount || counts[9] === maxCount || counts[9] === minCount) {
    return {
      type: 'WAIT',
      signal: 'WAIT',
      confidence: 0,
      evidence: 'Digits 8 or 9 are extreme (most/least appearing)',
      isValid: false,
    };
  }

  // Condition C: Find best trigger for digits < 8
  const matrix = computeTransitionMatrix(prices, pipSize);
  const targetDigits = [0, 1, 2, 3, 4, 5, 6, 7];
  const bestTrigger = findBestTrigger(matrix, targetDigits, [8, 9]);

  if (!bestTrigger || bestTrigger.probability < 50) {
    return {
      type: 'WAIT',
      signal: 'WAIT',
      confidence: 0,
      evidence: 'No qualified trigger with sufficient evidence',
      isValid: false,
    };
  }

  return {
    type: 'UNDER_8',
    signal: `BUY UNDER 8 AFTER ${bestTrigger.trigger}`,
    triggerDigit: bestTrigger.trigger,
    confidence: bestTrigger.probability,
    evidence: `P(next < 8 | ${bestTrigger.trigger}) = ${bestTrigger.probability.toFixed(1)}%`,
    isValid: true,
  };
}

/**
 * DIFFERS Strategy
 * Conditions:
 * - Find candidate digits with frequency < 10.5%
 * - Target must not be most/least appearing
 * - Find trigger where target rarely follows
 */
export function differsStrategy(
  digitStats: DigitStats,
  prices: number[],
  pipSize: number
): StrategyResult {
  const { percentages, counts } = digitStats;

  // Find candidate digits below 10.5%
  const candidates: number[] = [];
  for (let i = 0; i < 10; i++) {
    if (percentages[i] < 10.5) {
      candidates.push(i);
    }
  }

  if (candidates.length === 0) {
    return {
      type: 'WAIT',
      signal: 'WAIT',
      confidence: 0,
      evidence: 'No digits below 10.5% threshold',
      isValid: false,
    };
  }

  // Filter out most/least appearing
  const maxCount = Math.max(...counts);
  const minCount = Math.min(...counts);
  const qualifiedCandidates = candidates.filter(
    d => counts[d] !== maxCount && counts[d] !== minCount
  );

  if (qualifiedCandidates.length === 0) {
    return {
      type: 'WAIT',
      signal: 'WAIT',
      confidence: 0,
      evidence: 'All candidates are extreme (most/least appearing)',
      isValid: false,
    };
  }

  // For each candidate, find trigger where it rarely follows
  const matrix = computeTransitionMatrix(prices, pipSize);
  let bestResult: { target: number; trigger: number; probability: number } | null = null;
  let lowestProbability = 100;

  for (const target of qualifiedCandidates) {
    for (let trigger = 0; trigger < 10; trigger++) {
      if (matrix.rowTotals[trigger] < 5) continue; // Need minimum samples
      if (trigger === target) continue;

      const probability = matrix.matrix[trigger][target];
      if (probability > 0 && probability < lowestProbability) {
        lowestProbability = probability;
        bestResult = { target, trigger, probability };
      }
    }
  }

  if (!bestResult || bestResult.probability > 15) {
    return {
      type: 'WAIT',
      signal: 'WAIT',
      confidence: 0,
      evidence: 'No rare transition found with sufficient evidence',
      isValid: false,
    };
  }

  const confidence = 100 - bestResult.probability; // Inverse: rarer = higher confidence

  return {
    type: 'DIFFERS',
    signal: `BUY DIFFER ${bestResult.target} AFTER ${bestResult.trigger}`,
    triggerDigit: bestResult.trigger,
    targetDigit: bestResult.target,
    confidence,
    evidence: `P(next = ${bestResult.target} | ${bestResult.trigger}) = ${bestResult.probability.toFixed(1)}%`,
    isValid: true,
  };
}

/**
 * Unified Astral Signal Engine
 * Runs all three strategies and returns the best valid signal
 */
export function astralSignal(
  digitStats: DigitStats,
  prices: number[],
  pipSize: number
): StrategyResult {
  const results = [
    over1Strategy(digitStats, prices, pipSize),
    under8Strategy(digitStats, prices, pipSize),
    differsStrategy(digitStats, prices, pipSize),
  ];

  // Filter for valid results
  const validResults = results.filter(r => r.isValid);

  if (validResults.length === 0) {
    return {
      type: 'WAIT',
      signal: 'WAIT — NO QUALIFIED SETUP',
      confidence: 0,
      evidence: 'None of the three strategies has a complete setup',
      isValid: false,
    };
  }

  // Return the result with highest confidence
  validResults.sort((a, b) => b.confidence - a.confidence);
  return validResults[0];
}
