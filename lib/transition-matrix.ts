import type { DigitStats } from './types';

/**
 * Transition matrix cell representing P(next digit | current digit)
 */
export interface TransitionMatrix {
  /** 10x10 matrix where matrix[current][next] = P(next | current) */
  matrix: number[][];
  /** Total transitions for each current digit (row sums) */
  rowTotals: number[];
  /** Total transitions analyzed */
  totalTransitions: number;
}

/**
 * Compute transition matrix from price history.
 * Uses conditional probabilities: P(next digit | current digit)
 */
export function computeTransitionMatrix(prices: number[], pipSize: number): TransitionMatrix {
  const matrix = Array(10).fill(null).map(() => Array(10).fill(0));
  const rowTotals = Array(10).fill(0);
  let totalTransitions = 0;

  if (prices.length < 2) {
    return { matrix, rowTotals, totalTransitions };
  }

  // Extract digits from prices
  const digits = prices.map(price => {
    const priceStr = price.toFixed(pipSize);
    const lastChar = priceStr[priceStr.length - 1];
    return parseInt(lastChar, 10);
  });

  // Build transition matrix
  for (let i = 0; i < digits.length - 1; i++) {
    const current = digits[i];
    const next = digits[i + 1];
    matrix[current][next]++;
    rowTotals[current]++;
    totalTransitions++;
  }

  // Convert to conditional probabilities
  for (let i = 0; i < 10; i++) {
    if (rowTotals[i] > 0) {
      for (let j = 0; j < 10; j++) {
        matrix[i][j] = (matrix[i][j] / rowTotals[i]) * 100;
      }
    }
  }

  return { matrix, rowTotals, totalTransitions };
}

/**
 * Get probability of next digit being in a set given current digit
 */
export function getTransitionProbability(
  matrix: TransitionMatrix,
  currentDigit: number,
  targetDigits: number[]
): number {
  if (currentDigit < 0 || currentDigit > 9) return 0;
  
  let probability = 0;
  for (const target of targetDigits) {
    probability += matrix.matrix[currentDigit][target];
  }
  return probability;
}

/**
 * Find the best trigger digit for a strategy based on transition probabilities
 */
export function findBestTrigger(
  matrix: TransitionMatrix,
  targetDigits: number[],
  excludeDigits: number[] = []
): { trigger: number; probability: number } | null {
  let bestTrigger = -1;
  let bestProbability = 0;

  for (let current = 0; current < 10; current++) {
    if (excludeDigits.includes(current)) continue;
    if (matrix.rowTotals[current] < 5) continue; // Need minimum samples

    const probability = getTransitionProbability(matrix, current, targetDigits);
    if (probability > bestProbability) {
      bestProbability = probability;
      bestTrigger = current;
    }
  }

  if (bestTrigger === -1) return null;
  return { trigger: bestTrigger, probability: bestProbability };
}

/**
 * Find the rarest next digit for a trigger (for DIFFERS strategy)
 */
export function findRarestNext(
  matrix: TransitionMatrix,
  triggerDigit: number,
  excludeDigits: number[] = []
): { target: number; probability: number } | null {
  if (triggerDigit < 0 || triggerDigit > 9) return null;
  if (matrix.rowTotals[triggerDigit] < 5) return null;

  let rarestTarget = -1;
  let rarestProbability = 100;

  for (let next = 0; next < 10; next++) {
    if (excludeDigits.includes(next)) continue;
    const probability = matrix.matrix[triggerDigit][next];
    if (probability < rarestProbability && probability > 0) {
      rarestProbability = probability;
      rarestTarget = next;
    }
  }

  if (rarestTarget === -1) return null;
  return { target: rarestTarget, probability: rarestProbability };
}
