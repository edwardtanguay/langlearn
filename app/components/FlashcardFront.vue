<script setup lang="ts">
import { ref, watch } from 'vue'

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

function toggleMemoryHook() {
  if (memoryHookTimeout) clearTimeout(memoryHookTimeout)
  showMemoryHook.value = !showMemoryHook.value
  
  if (showMemoryHook.value) {
    memoryHookTimeout = setTimeout(() => {
      showMemoryHook.value = false
    }, 2000)
  }
}

watch(() => props.currentCard.id, () => {
  showMemoryHook.value = false
  if (memoryHookTimeout) clearTimeout(memoryHookTimeout)
})

watch(() => props.isFlipped, () => {
  showMemoryHook.value = false
  if (memoryHookTimeout) clearTimeout(memoryHookTimeout)
})

const getTextClass = (text: string) => {
  const len = text ? text.length : 0
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
  <div class="absolute inset-0 h-full w-full rounded-3xl backface-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 text-gray-850 dark:text-gray-100 overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl preserve-3d">
    <!-- Language badge (Absolute) -->
    <div class="absolute bottom-3 left-0 z-10 pointer-events-none backface-hidden">
      <div class="text-[10px] font-bold tracking-wider uppercase pl-4 pr-24 h-[32px] flex items-center !text-white pointer-events-auto"
        :style="{ 
          background: `linear-gradient(45deg, ${languageColors[currentCard.backLanguage] || '#4f46e5'} 20%, transparent 85%)`,
          backgroundImage: `
            linear-gradient(45deg, ${languageColors[currentCard.backLanguage] || '#4f46e5'} 20%, transparent 85%),
            repeating-linear-gradient(45deg, rgba(255,255,255,0.15) 0px, rgba(255,255,255,0.15) 2px, transparent 2px, transparent 6px)
          `,
          backgroundBlendMode: 'overlay',
          webkitMaskImage: 'linear-gradient(45deg, black 20%, transparent 80%)',
          maskImage: 'linear-gradient(45deg, black 20%, transparent 80%)'
        }">
        {{ languageNames[currentCard.backLanguage] || currentCard.backLanguage }}
      </div>
    </div>
    
    <!-- Word (Centered in padded area) -->
    <div class="h-full w-full flex flex-col items-center justify-center px-6 relative z-0 -translate-y-[15px]">
      <p :class="getTextClass(currentCard.front)">
        {{ currentCard.front }}
      </p>
      <!-- Memory Hook below front text -->
      <Transition name="fade-mnemonic">
        <p v-if="showMemoryHook && currentCard.memoryHook && !isFlipped && !isEditing" class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2 text-center max-w-md italic absolute top-[calc(50%+37px)] sm:top-[calc(50%+46px)]">
          "{{ currentCard.memoryHook }}"
        </p>
      </Transition>
    </div>

    <!-- Memory Link/Hook text button in the lower-right -->
    <button
      v-if="currentCard.memoryHook && !isFlipped && !isEditing"
      @click.stop="toggleMemoryHook"
      class="absolute bottom-3 right-4 flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider transition-all z-20 cursor-pointer select-none bg-transparent border-0 p-1.5 rounded-lg backface-hidden"
      :class="showMemoryHook 
        ? 'text-gray-700 dark:text-gray-300' 
        : 'text-gray-450 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'"
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
</style>
