export const METADATA_MARKER = '//';
export const OPTIMAL_FRONT_LENGTH = 34;
export const OPTIMAL_DEFAULT_RANK = 3.5;

export function calculateOptimalRank(frontText: string): number {
  const n = frontText.trim().length;
  const calculatedRank = OPTIMAL_DEFAULT_RANK - (0.05 * Math.abs(OPTIMAL_FRONT_LENGTH - n));
  const roundedRank = Math.round(calculatedRank * 100) / 100;
  return Math.max(0, roundedRank);
}
