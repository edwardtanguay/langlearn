export const languageColors: Record<string, string> = {
  en: '#9333ea',
  de: '#92400e',
  fr: '#60a5fa',
  es: '#e11d48',
  it: '#22c55e',
  nl: '#eab308',
  pl: '#b8b8b8',
  ru: '#94a3b8',
  is: '#0891b2',
  da: '#ff1493',
  el: '#ea580c'
}

export function getLanguageColor(lang?: string): string {
  if (!lang) return '#60a5fa'
  return languageColors[lang.toLowerCase()] || '#60a5fa'
}
