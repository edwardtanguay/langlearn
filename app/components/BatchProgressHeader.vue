<script setup lang="ts">
import { computed } from 'vue'

export interface BatchSlot {
  id: string
  slotIndex: number
  unsuccessfulCount: number
  status: 'untested' | 'testing' | 'learned' | 'parked' | 'deleted'
  language?: string
}

const props = defineProps<{
  slots: BatchSlot[]
  activeCardId?: string | null
  isBatchComplete?: boolean
}>()

const emit = defineEmits<{
  (e: 'selectSlot', cardId: string): void
}>()

import { languageColors } from '~/utils/languageColors'

const languageTextColors: Record<string, string> = {
  fr: '#3b82f6', // French = brighter blue
  it: '#22c55e', // Italian = brighter green
  es: '#ef4444', // Spanish = brighter red
  nl: '#eab308', // Dutch = brighter yellow
  pl: '#cbd5e1', // Polish = brighter gray
  de: '#ea580c', // German = warm orange
  ru: '#94a3b8',
  da: '#ff1493',
  en: '#a855f7',
  el: '#0d9488' // Greek = teal / emerald
}

function getLanguageColor(lang?: string): string {
  const code = (lang || 'fr').toLowerCase()
  return languageColors[code] || '#2563eb'
}

function getLanguageTextColor(lang?: string): string {
  const code = (lang || 'fr').toLowerCase()
  return languageTextColors[code] || getLanguageColor(lang)
}

function getSlotStyle(slot: BatchSlot) {
  if (slot.status === 'parked' || slot.status === 'deleted') {
    return {
      backgroundColor: 'rgba(107, 114, 128, 0.25)',
      borderColor: 'rgba(156, 163, 175, 0.4)',
      color: '#9ca3af',
      opacity: 0.5
    }
  }

  const color = getLanguageColor(slot.language)
  const textColor = getLanguageTextColor(slot.language)

  if (slot.status === 'learned') {
    return {
      backgroundColor: color,
      borderColor: color,
      color: '#ffffff',
      opacity: 1
    }
  }

  if (slot.unsuccessfulCount > 0) {
    return {
      backgroundColor: `color-mix(in srgb, ${color} 25%, transparent)`,
      borderColor: color,
      color: textColor,
      opacity: 1
    }
  }

  // Untested
  return {
    backgroundColor: `color-mix(in srgb, ${color} 15%, transparent)`,
    borderColor: `color-mix(in srgb, ${color} 50%, transparent)`,
    color: textColor,
    opacity: 0.95
  }
}

const totalCount = computed(() => props.slots.length)
const testedCount = computed(() => props.slots.filter(s => s.status !== 'untested').length)
const learnedCount = computed(() => props.slots.filter(s => s.status === 'learned').length)

const percent = computed(() => {
  if (totalCount.value <= 0) return 0
  return Math.min(100, Math.round((learnedCount.value / totalCount.value) * 100))
})
</script>

<template>
  <div class="w-full px-1 py-1 transition-all">
    <!-- Capsule Pills Row with language abbreviation above each box -->
    <div v-if="slots.length > 0" class="flex items-start gap-1 sm:gap-1.5 w-full">
      <div
        v-for="slot in slots"
        :key="slot.id"
        class="flex-1 min-w-0 flex flex-col items-center"
      >
        <!-- Language abbreviation above the box in its language color -->
        <span
          class="text-[10px] sm:text-xs font-mono font-bold mb-1 select-none tracking-wider"
          :style="{ color: getLanguageColor(slot.language) }"
        >
          {{ (slot.language || 'FR').toUpperCase() }}
        </span>
        <!-- The Pill Capsule -->
        <div
          @click="!isBatchComplete && emit('selectSlot', slot.id)"
          class="w-full h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-200 select-none border"
          :class="[
            !isBatchComplete ? 'cursor-pointer hover:brightness-110 active:scale-95' : 'cursor-default',
            slot.id === activeCardId && !isBatchComplete
              ? 'scale-105 z-10'
              : ''
          ]"
          :style="[
            getSlotStyle(slot),
            slot.id === activeCardId && !isBatchComplete
              ? {
                  borderColor: getLanguageTextColor(slot.language),
                  boxShadow: `0 0 0 2px ${getLanguageTextColor(slot.language)}, 0 4px 6px -1px rgba(0, 0, 0, 0.1)`
                }
              : {}
          ]"
          :title="`Card ${slot.slotIndex + 1}: ${
            slot.status === 'learned' 
              ? 'Learned' 
              : slot.status === 'parked' 
                ? 'Parked' 
                : slot.status === 'deleted' 
                  ? 'Deleted' 
                  : slot.unsuccessfulCount > 0 
                    ? `Tested ${slot.unsuccessfulCount} time${slot.unsuccessfulCount > 1 ? 's' : ''} (keep testing)` 
                    : 'Not yet tested'
          }`"
        >
          <!-- Learned State: Bold checkmark in lighter color of the language color -->
          <svg
            v-if="slot.status === 'learned'"
            class="w-4 h-4 stroke-[2.5]"
            :style="{ color: `color-mix(in srgb, ${getLanguageColor(slot.language)} 35%, white)` }"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>

          <!-- Parked State: Gray -->
          <svg
            v-else-if="slot.status === 'parked'"
            class="w-3 h-3 text-gray-400 dark:text-gray-500"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="6" y="5" width="4" height="14" rx="1.5" />
            <rect x="14" y="5" width="4" height="14" rx="1.5" />
          </svg>

          <!-- Deleted State: Gray -->
          <span v-else-if="slot.status === 'deleted'" class="text-[11px] leading-none font-bold text-gray-400 dark:text-gray-500">✕</span>

          <!-- Currently active card slot: shows current test count (e.g. 1x, 2x) pulsating slowly -->
          <span
            v-else-if="slot.id === activeCardId && !isBatchComplete"
            class="text-xs font-mono font-bold leading-none animate-slow-pulse"
            :style="{ color: getLanguageTextColor(slot.language) }"
          >
            {{ slot.unsuccessfulCount + 1 }}x
          </span>

          <!-- Non-active unsuccessful tested count (e.g. 1x, 2x) in language color -->
          <span
            v-else-if="slot.unsuccessfulCount > 0"
            class="text-xs font-mono font-bold leading-none"
            :style="{ color: getLanguageTextColor(slot.language) }"
          >
            {{ slot.unsuccessfulCount }}x
          </span>

          <!-- Untested State: Delicate 5-point outline star in language color -->
          <svg
            v-else
            class="w-3.5 h-3.5"
            :style="{ color: getLanguageTextColor(slot.language) }"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.75"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>

        <!-- Upward Arrow Pointer underneath active pill -->
        <div class="h-3.5 flex items-center justify-center mt-1">
          <svg
            v-if="slot.id === activeCardId && !isBatchComplete"
            class="w-3 h-3 animate-pulse drop-shadow-xs"
            :style="{ color: getLanguageTextColor(slot.language) }"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 4l-8 8h5v8h6v-8h5z" />
          </svg>
          <div v-else class="w-3 h-3 invisible" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slowPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.08);
  }
}

.animate-slow-pulse {
  display: inline-block;
  animation: slowPulse 2.2s infinite ease-in-out;
}
</style>
