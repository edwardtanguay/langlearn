<script setup lang="ts">
import { computed } from 'vue'
import { languageColors as defaultColors } from '~/utils/languageColors'

export interface LanguageMenuItem {
  code: string
  label?: string
  badge?: string | number
}

const defaultLanguageTitles: Record<string, string> = {
  fr: 'French',
  es: 'Spanish',
  it: 'Italian',
  nl: 'Dutch',
  de: 'German',
  en: 'English',
  pl: 'Polish',
  ru: 'Russian',
  is: 'Icelandic',
  da: 'Danish',
  el: 'Greek'
}

const props = withDefaults(defineProps<{
  languages: (string | LanguageMenuItem)[]
  languageTitles?: Record<string, string>
  colors?: Record<string, string>
  wrapperClass?: string
}>(), {
  languageTitles: () => ({}),
  colors: () => defaultColors,
  wrapperClass: 'flex flex-wrap items-center gap-2 pt-1 pb-1'
})

const modelValue = defineModel<string>({ required: true })

const normalizedLanguages = computed<LanguageMenuItem[]>(() => {
  return props.languages.map(item => {
    if (typeof item === 'string') {
      const code = item.toLowerCase()
      const title = props.languageTitles[code] || defaultLanguageTitles[code] || code.toUpperCase()
      return { code, label: title }
    }
    const code = item.code.toLowerCase()
    const title = item.label || props.languageTitles[code] || defaultLanguageTitles[code] || code.toUpperCase()
    return {
      code,
      label: title,
      badge: item.badge
    }
  })
})

function getLangColor(code: string): string {
  return props.colors[code] || defaultColors[code] || '#6366f1'
}
</script>

<template>
  <div v-if="normalizedLanguages.length > 0" :class="wrapperClass">
    <button
      v-for="item in normalizedLanguages"
      :key="item.code"
      type="button"
      @click="modelValue = item.code"
      class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs border inline-flex items-center gap-1.5 select-none"
      :style="modelValue.toLowerCase() === item.code ? {
        backgroundColor: getLangColor(item.code),
        borderColor: getLangColor(item.code),
        color: '#ffffff'
      } : {
        borderColor: `color-mix(in srgb, ${getLangColor(item.code)} 50%, transparent)`,
        color: getLangColor(item.code),
        backgroundColor: `color-mix(in srgb, ${getLangColor(item.code)} 10%, transparent)`
      }"
    >
      <span>{{ item.label }}</span>
      <span
        v-if="item.badge !== undefined"
        class="text-[11px] font-semibold px-1.5 py-0.2 rounded"
        :class="modelValue.toLowerCase() === item.code ? 'bg-black/25 text-white/95' : 'bg-black/10 dark:bg-white/10 text-inherit'"
      >
        {{ item.badge }}
      </span>
      <slot name="badge" :item="item" :is-selected="modelValue.toLowerCase() === item.code" />
    </button>
  </div>
</template>
