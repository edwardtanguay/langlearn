/**
 * Compares two SemVer strings in descending order (e.g. 0.10.0 comes before 0.9.1).
 * Strips leading 'v' if present and handles missing parts safely.
 */
export function compareSemVerDesc(v1: string | null | undefined, v2: string | null | undefined): number {
  if (!v1 && !v2) return 0
  if (!v1) return 1
  if (!v2) return -1

  const clean1 = v1.replace(/^v/i, '').trim()
  const clean2 = v2.replace(/^v/i, '').trim()

  const p1 = clean1.split('.').map(n => parseInt(n, 10))
  const p2 = clean2.split('.').map(n => parseInt(n, 10))
  const maxLen = Math.max(p1.length, p2.length)

  for (let i = 0; i < maxLen; i++) {
    const num1 = Number.isNaN(p1[i]) ? 0 : (p1[i] ?? 0)
    const num2 = Number.isNaN(p2[i]) ? 0 : (p2[i] ?? 0)
    if (num1 !== num2) return num2 - num1
  }

  return 0
}

/**
 * Compares two SemVer strings in ascending order.
 */
export function compareSemVerAsc(v1: string | null | undefined, v2: string | null | undefined): number {
  return compareSemVerDesc(v2, v1)
}
