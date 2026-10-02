/**
 * Formats a pronunciation string replacing French nasal markers:
 * (on), (an), (en), (in), and (un)
 * with the pill style defined in dev/SANDBOX/nasal/nasal-styling-v2.html
 */
export function formatPronunciationHtml(text?: string | null): string {
  if (!text) return ''
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

  return escaped.replace(/\((on|an|en|in|un)\)/gi, (_match, p1) => {
    return `<span class="nasal">${p1}</span>`
  })
}
