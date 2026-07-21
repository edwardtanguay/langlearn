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
