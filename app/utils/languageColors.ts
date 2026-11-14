export const languageColors: Record<string, string> = {
  en: '#9333ea',
  de: '#ea580c',
  fr: '#60a5fa',
  es: '#e11d48',
  it: '#22c55e',
  nl: '#eab308',
  pl: '#b8b8b8',
  ru: '#94a3b8',
  is: '#0891b2',
  da: '#ff1493',
  el: '#0d9488'
}

export function getLanguageColor(lang?: string): string {
  if (!lang) return '#60a5fa'
  return languageColors[lang.toLowerCase()] || '#60a5fa'
}

export function getLanguageContrastTextColor(lang?: string): string {
  const hex = getLanguageColor(lang).replace('#', '')
  if (hex.length !== 6) return '#ffffff'
  const r = parseInt(hex.slice(0, 2), 16) / 255
  const g = parseInt(hex.slice(2, 4), 16) / 255
  const b = parseInt(hex.slice(4, 6), 16) / 255
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  return luminance > 0.34 ? '#111827' : '#ffffff'
}
