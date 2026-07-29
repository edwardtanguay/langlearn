export const BASE_WAIT_MINUTES = 30
export const RANK_MULTIPLIER = 4

export function calculateNextTestTime(lastTestedIso: string | Date | null | undefined, rank: number): Date | null {
  if (!lastTestedIso) return null
  
  const lastTestedDate = typeof lastTestedIso === 'string' ? new Date(lastTestedIso) : lastTestedIso
  const waitMinutes = BASE_WAIT_MINUTES - (rank * RANK_MULTIPLIER)
  
  return new Date(lastTestedDate.getTime() + waitMinutes * 60 * 1000)
}

export function isCardDue(nextTestDate: Date | null): boolean {
  if (!nextTestDate) return true
  return Date.now() >= nextTestDate.getTime()
}

export interface InterleaveOptions {
  newRatio?: number
  dueRatio?: number
}

export function buildInterleavedQueue<T>(
  newCards: T[],
  dueCards: T[],
  options: InterleaveOptions = {}
): T[] {
  const newRatio = options.newRatio ?? 3
  const dueRatio = options.dueRatio ?? 1

  const result: T[] = []
  let newIdx = 0
  let dueIdx = 0

  while (newIdx < newCards.length || dueIdx < dueCards.length) {
    // Pick up to newRatio cards from newCards pool
    for (let i = 0; i < newRatio && newIdx < newCards.length; i++) {
      result.push(newCards[newIdx]!)
      newIdx++
    }

    // Pick up to dueRatio cards from dueCards pool
    for (let i = 0; i < dueRatio && dueIdx < dueCards.length; i++) {
      result.push(dueCards[dueIdx]!)
      dueIdx++
    }
  }

  return result
}

