<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface Tag {
  id: string
  abbreviation: string
  description?: string
}

interface Flashcard {
  id: string
  front: string
  back: string
  frontLanguage: string
  backLanguage: string
  pronunciation?: string | null
  status: string
  rank: number
  memoryHook: string | null
  tags: { tag: Tag }[]
}

const props = defineProps<{
  currentCard: Flashcard
  languageNames: Record<string, string>
  languageColors: Record<string, string>
  isFlipped: boolean
  isEditing: boolean
}>()

const showMemoryHook = ref(false)
let memoryHookTimeout: ReturnType<typeof setTimeout> | null = null
const isFlickering = ref(false)

function toggleMemoryHook() {
  if (memoryHookTimeout) clearTimeout(memoryHookTimeout)
  showMemoryHook.value = !showMemoryHook.value
  
  if (showMemoryHook.value) {
    memoryHookTimeout = setTimeout(() => {
      showMemoryHook.value = false
    }, 4000)
  }
}

watch(() => props.currentCard.id, (newId, oldId) => {
  showMemoryHook.value = false
  if (memoryHookTimeout) clearTimeout(memoryHookTimeout)
})

// Trigger visual cue flicker when language changes between cards
watch(() => props.currentCard.backLanguage, (newLang, oldLang) => {
  if (oldLang && newLang !== oldLang) {
    isFlickering.value = true
    setTimeout(() => {
      isFlickering.value = false
    }, 600)
  }
}, { immediate: true })

const isFrenchCard = computed(() => {
  const lang = (props.currentCard.backLanguage || props.currentCard.frontLanguage || '').toLowerCase()
  return lang === 'fr'
})

const hasVous = computed(() => {
  const back = props.currentCard.back || ''
  return /\bvous\b/i.test(back)
})

function openVousToTuSearch() {
  const query = `convert "vous" to "tu" for the following French phrase: "${props.currentCard.back}"`
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`
  window.open(url, '_blank')
}

const stripFormatting = (text: string) => {
  if (!text) return ''
  return text.replace(/[\*<>]/g, '')
}

const renderFrontTextWithHighlights = (text: string) => {
  if (!text) return ''
  // Replace <verb> with solid underline & amber tint
  let result = text.replace(/<([^>]+)>/g, '<span class="border-b-2 border-amber-400 dark:border-amber-400 bg-amber-500/20 dark:bg-amber-500/25 px-1 rounded-sm">$1</span>')
  // Replace *text* with dashed underline
  result = result.replace(/\*(.*?)\*/g, '<span class="border-b border-dashed border-gray-400 dark:border-white/60 bg-gray-200/40 dark:bg-white/10 px-1 rounded-sm">$1</span>')
  return result
}

const getTextClass = (text: string) => {
  const clean = stripFormatting(text)
  const len = clean ? clean.length : 0
  if (len < 30) {
    return 'text-2xl sm:text-3xl text-center leading-tight max-w-md'
  } else if (len < 60) {
    return 'text-xl sm:text-3xl text-center leading-tight max-w-md'
  } else if (len < 100) {
    return 'text-lg sm:text-2xl text-center leading-tight max-w-md'
  } else {
    return 'text-base sm:text-xl line-clamp-3 text-center leading-tight max-w-md'
  }
}
</script>

<template>
  <div 
    class="absolute inset-0 h-full w-full rounded-3xl backface-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 text-gray-850 dark:text-gray-100 overflow-hidden border-4 shadow-xl preserve-3d"
    :style="{ borderColor: languageColors[currentCard.backLanguage] || '#333388' }"
  >
    <!-- Language badge (Absolute) -->
    <div class="absolute bottom-3 left-0 z-10 pointer-events-none backface-hidden">
      <div 
        class="text-[12px] font-black tracking-wider uppercase pl-4 pr-24 h-[32px] flex items-center !text-white pointer-events-auto transition-transform"
        :class="{ 'animate-lang-flicker': isFlickering }"
        :style="{ 
          background: `linear-gradient(45deg, ${languageColors[currentCard.backLanguage] || '#4f46e5'} 20%, transparent 85%)`,
          backgroundImage: `
            linear-gradient(45deg, ${languageColors[currentCard.backLanguage] || '#4f46e5'} 20%, transparent 85%),
            repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 6px)
          `,
          backgroundBlendMode: 'overlay',
          WebkitMaskImage: 'linear-gradient(45deg, black 20%, transparent 80%)',
          maskImage: 'linear-gradient(45deg, black 20%, transparent 80%)'
        }">
        <span style="text-shadow: 0 1px 1px rgba(0, 0, 0, 0.85);">
          {{ languageNames[currentCard.backLanguage] || currentCard.backLanguage }}
        </span>
      </div>
    </div>

    <!-- Word (Centered in padded area) -->
    <div class="h-full w-full flex flex-col items-center justify-center px-6 relative z-0 -translate-y-[15px]">
      <p 
        :class="getTextClass(currentCard.front)"
        v-html="renderFrontTextWithHighlights(currentCard.front)"
      ></p>
      <!-- Memory Hook below front text with pulsating effect -->
      <Transition name="fade-mnemonic">
        <p v-if="showMemoryHook && currentCard.memoryHook && !isFlipped && !isEditing" class="text-xs sm:text-sm text-amber-600 dark:text-amber-400 mt-2 text-center max-w-md italic absolute top-[calc(50%+37px)] sm:top-[calc(50%+46px)] animate-pulsate font-medium">
          "{{ currentCard.memoryHook }}"
        </p>
      </Transition>
    </div>

    <!-- Memory Link/Hook text button in the lower-right with pulsating visual cue -->
    <button
      v-if="currentCard.memoryHook && !isFlipped && !isEditing"
      @click.stop="toggleMemoryHook"
      class="absolute bottom-3 right-4 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider transition-all z-20 cursor-pointer select-none bg-transparent border-0 p-1.5 rounded-lg backface-hidden"
      :class="showMemoryHook 
        ? 'text-amber-600 dark:text-amber-400 font-extrabold' 
        : 'text-amber-500 dark:text-amber-400 animate-pulsate hover:text-amber-700 dark:hover:text-amber-200'"
      :title="showMemoryHook ? 'Hide Memory Hook' : 'Show Memory Hook'"
    >
      <span>memory link</span>
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
.fade-mnemonic-enter-active,
.fade-mnemonic-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-mnemonic-enter-from,
.fade-mnemonic-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@keyframes langFlickerKeyframe {
  0% { opacity: 1; transform: scale(1); }
  25% { opacity: 0.2; transform: scale(1.15); filter: brightness(1.8); }
  50% { opacity: 1; transform: scale(0.95); }
  75% { opacity: 0.3; transform: scale(1.08); filter: brightness(1.8); }
  100% { opacity: 1; transform: scale(1); }
}

.animate-lang-flicker {
  animation: langFlickerKeyframe 0.6s ease-in-out;
}

@keyframes pulsateKeyframe {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.03); }
}

.animate-pulsate {
  animation: pulsateKeyframe 1.8s infinite ease-in-out;
}
</style>
